# Capability Manifest Validation

This folder contains representative manifests and automated validation for the AgentPRSL-AI Capability Contract.

Run locally:

```bash
python -m pip install -r requirements-dev.txt
python scripts/validate_capability_manifests.py
```

The validator checks JSON Schema compliance, unique IDs, module/ID consistency, and permission declaration consistency. It validates architecture artifacts; it does not test a live capability runtime.
