#!/usr/bin/env node

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import { homedir } from "os";
import { Command } from "commander";

const program = new Command();

program
  .name("llmtrust-completions")
  .description("Install shell completions for llmtrust CLI");

// Bash completion script
const BASH_COMPLETION = `
_llmtrust_completions()
{
  local cur prev commands
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  commands="compare models info providers search score bench auth help"

  if [ \$COMP_CWORD -eq 1 ]; then
    COMPREPLY=( \$(compgen -W "\${commands}" -- \${cur}) )
    return 0
  fi

  case "\${prev}" in
    compare|bench)
      # Model IDs - suggest common ones
      COMPREPLY=( \$(compgen -W "gpt-4o gpt-4o-mini claude-3.5-sonnet gemini-1.5-pro" -- \${cur}) )
      ;;
    score|info)
      COMPREPLY=( \$(compgen -W "gpt-4o gpt-4o-mini claude-3.5-sonnet gemini-1.5-pro" -- \${cur}) )
      ;;
    search)
      COMPREPLY=( \$(compgen -W "code vision cheap fast" -- \${cur}) )
      ;;
    models)
      COMPREPLY=( \$(compgen -W "--provider" -- \${cur}) )
      ;;
    bench)
      COMPREPLY=( \$(compgen -W "-s --suite --compare --no-telemetry" -- \${cur}) )
      ;;
    auth)
      COMPREPLY=( \$(compgen -W "status login logout" -- \${cur}) )
      ;;
    --suite)
      COMPREPLY=( \$(compgen -W "standard code safety" -- \${cur}) )
      ;;
    --provider)
      COMPREPLY=( \$(compgen -W "OpenAI Anthropic Google Mistral Meta Cohere DeepSeek" -- \${cur}) )
      ;;
    --sort)
      COMPREPLY=( \$(compgen -W "asc desc" -- \${cur}) )
      ;;
    --capability)
      COMPREPLY=( \$(compgen -W "text vision function-calling code" -- \${cur}) )
      ;;
  esac
}
complete -F _llmtrust_completions llmtrust
`;

// Zsh completion script
const ZSH_COMPLETION = `#compdef llmtrust

_llmtrust() {
  local -a commands
  commands=(
    'compare:Compare LLM models side-by-side'
    'models:List all supported models'
    'info:Show detailed information about a model'
    'providers:List all available providers'
    'search:Search for models by name or capability'
    'score:View trust scores for models'
    'bench:Run benchmarks on models'
    'auth:Manage authentication'
  )

  _arguments -C \\
    '1:command:->command' \\
    '*::arg:->args'

  case $state in
    command)
      _describe 'command' commands
      ;;
    args)
      case $words[1] in
        compare|bench)
          _values 'models' gpt-4o gpt-4o-mini claude-3.5-sonnet gemini-1.5-pro
          ;;
        score|info)
          _values 'models' gpt-4o gpt-4o-mini claude-3.5-sonnet gemini-1.5-pro
          ;;
        auth)
          _values 'auth commands' status login logout
          ;;
        bench)
          _arguments \\
            '--suite=[Benchmark suite]:suite:(standard code safety)' \\
            '--compare[Compare benchmarks side-by-side]' \\
            '--no-telemetry[Disable telemetry]'
          ;;
        search)
          _arguments \\
            '--max-latency=[Maximum latency in ms]' \\
            '--max-cost=[Maximum cost per 1M tokens]' \\
            '--min-context=[Minimum context window]' \\
            '--capability=[Filter by capability]' \\
            '--provider=[Filter by provider]' \\
            '--min-trust=[Minimum trust score]'
          ;;
      esac
      ;;
  esac
}

_llmtrust
`;

// Fish completion script
const FISH_COMPLETION = `# Fish completions for llmtrust CLI

# Commands
complete -c llmtrust -f -n '__fish_use_subcommand' -a compare -d 'Compare LLM models side-by-side'
complete -c llmtrust -f -n '__fish_use_subcommand' -a models -d 'List all supported models'
complete -c llmtrust -f -n '__fish_use_subcommand' -a info -d 'Show detailed information about a model'
complete -c llmtrust -f -n '__fish_use_subcommand' -a providers -d 'List all available providers'
complete -c llmtrust -f -n '__fish_use_subcommand' -a search -d 'Search for models by name or capability'
complete -c llmtrust -f -n '__fish_use_subcommand' -a score -d 'View trust scores for models'
complete -c llmtrust -f -n '__fish_use_subcommand' -a bench -d 'Run benchmarks on models'
complete -c llmtrust -f -n '__fish_use_subcommand' -a auth -d 'Manage authentication'

# Models for relevant commands
complete -c llmtrust -f -n '__fish_seen_subcommand_from compare bench score info' -a 'gpt-4o gpt-4o-mini claude-3.5-sonnet gemini-1.5-pro'

# Auth subcommands
complete -c llmtrust -f -n '__fish_seen_subcommand_from auth' -a status -d 'Show authentication status'
complete -c llmtrust -f -n '__fish_seen_subcommand_from auth' -a login -d 'Authenticate with an API key'
complete -c llmtrust -f -n '__fish_seen_subcommand_from auth' -a logout -d 'Log out'

# Bench options
complete -c llmtrust -f -n '__fish_seen_subcommand_from bench' -s s -l suite -a 'standard code safety' -d 'Benchmark suite'
complete -c llmtrust -f -n '__fish_seen_subcommand_from bench' -l compare -d 'Compare benchmarks side-by-side'
complete -c llmtrust -f -n '__fish_seen_subcommand_from bench' -l no-telemetry -d 'Disable telemetry'

# Search options
complete -c llmtrust -f -n '__fish_seen_subcommand_from search' -l max-latency -d 'Maximum latency in ms'
complete -c llmtrust -f -n '__fish_seen_subcommand_from search' -l max-cost -d 'Maximum cost per 1M tokens'
complete -c llmtrust -f -n '__fish_seen_subcommand_from search' -l min-context -d 'Minimum context window'
complete -c llmtrust -f -n '__fish_seen_subcommand_from search' -l capability -d 'Filter by capability'
complete -c llmtrust -f -n '__fish_seen_subcommand_from search' -l provider -d 'Filter by provider'
complete -c llmtrust -f -n '__fish_seen_subcommand_from search' -l min-trust -d 'Minimum trust score'
`;

export function generateCompletions(shell: string, outputPath?: string): void {
  let script: string;
  let filename: string;

  switch (shell) {
    case "bash":
      script = BASH_COMPLETION;
      filename = "llmtrust";
      break;
    case "zsh":
      script = ZSH_COMPLETION;
      filename = "_llmtrust";
      break;
    case "fish":
      script = FISH_COMPLETION;
      filename = "llmtrust.fish";
      break;
    default:
      console.error(chalk.red(`\n  ✗ Unknown shell: ${shell}`));
      console.log(chalk.dim("  Supported shells: bash, zsh, fish\n"));
      process.exit(1);
  }

  if (outputPath) {
    writeFileSync(join(outputPath, filename), script);
    console.log(chalk.green(`\n  ✓ Completions written to ${join(outputPath, filename)}`));
    console.log(chalk.dim(`  Source it: source ${join(outputPath, filename)}\n`));
  } else {
    // Print to stdout
    console.log(script);
  }
}

export { BASH_COMPLETION, ZSH_COMPLETION, FISH_COMPLETION };
