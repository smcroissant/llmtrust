from setuptools import setup, find_packages

setup(
    name="llmtrust",
    version="0.1.0",
    description="Trust scores for LLMs — OpenAI wrapper + LangChain integration",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="CroissantLabs",
    license="MIT",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "httpx>=0.25.0",
        "pydantic>=2.0.0",
    ],
    extras_require={
        "langchain": ["langchain-core>=0.1.0"],
        "openai": ["openai>=1.0.0"],
        "dev": ["pytest", "pytest-asyncio", "ruff", "mypy"],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    keywords=["llm", "ai", "trust", "openai", "langchain", "scoring"],
)
