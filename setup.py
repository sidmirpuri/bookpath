from pathlib import Path

from setuptools import find_packages, setup


requirements = Path("requirements.txt").read_text(encoding="utf-8").splitlines()

setup(
    name="bookpath",
    version="0.1.0",
    description="Shared preprocessing utilities for the BookPath project.",
    packages=find_packages(),
    install_requires=requirements,
)
