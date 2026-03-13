# Models FAQ

## What models are available?

LLM Trust features a comprehensive catalog of large language models spanning both open-source and commercial offerings. Our directory includes popular models like Llama, Mistral, Phi, Gemma, Qwen, and many others from organizations including Meta, Google, Microsoft, and the broader open-source community. We cover models ranging from small, efficient architectures designed for edge deployment to massive frontier models intended for server-grade hardware.

New models are added regularly as the ecosystem evolves. Our team monitors releases from major labs and the open-source community to ensure our catalog stays current. Each model listing includes multiple quantized versions, so you can find the variant that best matches your hardware constraints and performance requirements.

## How are models verified?

Model verification on LLM Trust is a multi-step process designed to ensure the information we present is accurate and trustworthy. First, our automated systems cross-reference model metadata against official repositories, Hugging Face listings, and primary source documentation. This catches obvious inconsistencies in parameter counts, context lengths, and architectural details.

Second, our community plays an active role in verification. Experienced users can flag discrepancies, suggest corrections, and contribute additional context based on their own testing and deployment experience. Models with a high verification score have been reviewed by multiple community members and confirmed against primary sources. We display a verification badge and confidence score on each model page so you know exactly how thoroughly a model has been vetted.

## Can I upload my own model?

Yes, LLM Trust supports model submissions from the community. If you've trained or fine-tuned a model and want to share it, you can submit it through our submission portal. You'll need to provide comprehensive metadata including the model's architecture, parameter count, training data description, license, intended use cases, and download links. We also encourage uploading benchmark results and a model card with usage guidelines.

All submissions go through a review process before being published. Our team checks for completeness, accuracy of metadata, and compliance with our content policies. We may reach out for clarification or additional information. Once approved, your model will appear in our directory and be searchable and reviewable by the community, helping users discover your work.

## What file formats are supported?

LLM Trust primarily supports and recommends the GGUF format for model downloads, as it is the most widely compatible format for local inference across various hardware configurations. GGUF models work seamlessly with popular inference engines like llama.cpp, Ollama, and many others. We also list models available in other common formats including SafeTensors, PyTorch bin files, and ONNX.

For each model in our directory, we clearly indicate which file formats are available for download, along with the specific quantization variants offered. Our filter system allows you to search for models available in your preferred format. If a model is available in multiple formats, you'll see all options listed on its detail page with file sizes and recommended use cases for each.

## How do I download a model?

Downloading a model from LLM Trust is simple. Navigate to the model's detail page and scroll to the Downloads section, where you'll find links to all available variants organized by quantization level and file format. Click on the download link for your preferred variant, and you'll be directed to the hosting platform — typically Hugging Face or the model's official repository — where the download will begin.

Before downloading, we recommend checking the system requirements listed on the model page, including minimum RAM, VRAM, and recommended hardware. Our model cards also include quick-start instructions for popular inference frameworks, so you can go from download to running the model in just a few steps. For very large models, we provide guidance on splitting downloads and verifying file integrity with checksums.

## What is a quantization?

Quantization is a technique that reduces the precision of a model's weights to decrease its file size and memory requirements, enabling it to run on less powerful hardware. A full-precision model might use 32-bit or 16-bit floating-point numbers for each weight, but quantization can compress these to 8-bit, 5-bit, 4-bit, or even lower representations with minimal impact on output quality.

On LLM Trust, you'll see models offered in various quantization levels denoted by labels like Q4_K_M, Q5_K_S, or Q8_0. Higher quantization levels (closer to the original precision) preserve more accuracy but require more memory, while lower levels save resources at the cost of some quality. Our model pages include guidance on which quantization level is recommended for different hardware setups, helping you find the right balance between performance and resource usage for your specific situation.
