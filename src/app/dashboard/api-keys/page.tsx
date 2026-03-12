"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function ApiKeysPage() {
  const utils = trpc.useUtils();
  const { data: apiKeys, isLoading } = trpc.user.apiKeys.useQuery();
  const createKey = trpc.user.createApiKey.useMutation({
    onSuccess: (data) => {
      toast.success("API key created! Copy it now — it won't be shown again.");
      setNewKey(data.key);
      utils.user.apiKeys.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const revokeKey = trpc.user.revokeApiKey.useMutation({
    onSuccess: () => {
      toast.success("API key revoked");
      utils.user.apiKeys.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    createKey.mutate({ name: keyName || "Default" });
    setKeyName("");
  };

  const handleRevoke = (id: string) => {
    revokeKey.mutate({ id });
    setRevokeDialogOpen(null);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Key className="size-5 text-primary" />
            API Keys
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage API keys for the Electron app and external integrations
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 size-4" />
            Create Key
          </DialogTrigger>
          <DialogContent>
            {newKey ? (
              <>
                <DialogHeader>
                  <DialogTitle>Your API Key</DialogTitle>
                  <DialogDescription>
                    Copy this key now. It will not be shown again.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm font-mono break-all">
                      {newKey}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(newKey)}
                    >
                      {copied ? (
                        <Check className="size-4 text-green-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    <span>
                      Store this key securely. You will not be able to see it again.
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setNewKey(null);
                      setCreateDialogOpen(false);
                    }}
                  >
                    Done
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>
                    Give your key a name to identify it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input
                      id="key-name"
                      placeholder="e.g., My Electron App"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={createKey.isPending}>
                    {createKey.isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 size-4" />
                    )}
                    Create
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Keys List */}
      {apiKeys && apiKeys.length > 0 ? (
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <GlowCard key={key.id}>
              <GlowCardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Key className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{key.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {key.prefix}••••••••
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </div>
                      {key.lastUsedAt && (
                        <p className="text-xs text-muted-foreground">
                          Last used {new Date(key.lastUsedAt).toLocaleDateString()}
                        </p>
                      )}
                      {key.expiresAt && (
                        <Badge variant="outline" className="text-[10px] mt-1">
                          Expires {new Date(key.expiresAt).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>

                    <Dialog
                      open={revokeDialogOpen === key.id}
                      onOpenChange={(open) =>
                        setRevokeDialogOpen(open ? key.id : null)
                      }
                    >
                      <DialogTrigger className="inline-flex items-center justify-center rounded-md p-2 text-destructive hover:bg-destructive/10">
                        <Trash2 className="size-4" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Revoke API Key</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to revoke &quot;{key.name}&quot;?
                            This action cannot be undone and any apps using this key will stop working.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setRevokeDialogOpen(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRevoke(key.id)}
                            disabled={revokeKey.isPending}
                          >
                            {revokeKey.isPending ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 size-4" />
                            )}
                            Revoke Key
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </GlowCardContent>
            </GlowCard>
          ))}
        </div>
      ) : (
        <GlowCard>
          <GlowCardContent className="pt-6">
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Key className="size-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No API keys yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an API key to connect the Electron app or other integrations.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 size-4" />
                Create your first key
              </Button>
            </div>
          </GlowCardContent>
        </GlowCard>
      )}

      {/* Info Card */}
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle className="text-base">About API Keys</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            API keys authenticate requests from the Electron desktop app and external tools.
            Each key is prefixed with <code className="text-xs bg-muted px-1 rounded">llmt_</code>.
          </p>
          <Separator />
          <ul className="list-disc list-inside space-y-1">
            <li>Keys are hashed and stored securely — the full key is only shown once at creation</li>
            <li>Use the <code className="text-xs bg-muted px-1 rounded">X-API-Key</code> header for authentication</li>
            <li>Keys can be revoked at any time</li>
            <li>Optional expiry can be set when creating keys via the API</li>
          </ul>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}
