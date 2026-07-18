# HimBhasha AI — Offline Translation Module

The `app.services.translation` package provides a 100% offline, zero-cloud translation engine supporting **Kangri**, **Hindi**, and **English**.

## Architecture & Components

- `translation_service.py`: High-level entry point orchestration service.
- `translation_engine.py`: 4-tier matching engine (Exact, Keyword, RapidFuzz, Phrase matching).
- `translation_models.py`: Pydantic request & response models.
- `translation_utils.py`: Text normalization and script/language detection algorithms.

## Supported Directions

- **Kangri → Hindi / English**
- **Hindi → Kangri / English**
- **English → Kangri / Hindi**

## Performance

- In-memory dataset caching ensures query translation completes in **< 100ms**.
