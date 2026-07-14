# Government Dataset Schema

This domain uses the standard HIMCorpus Schema. The table below represents the columns and values specific to the `government` domain.

| Column | Constained Value / Format | Description |
| ------ | ------------------------- | ----------- |
| `id` | `kng_govt_[seq]` | Unique sequence ID |
| `domain` | `government` | Category tag |
| `intent` | Must be one of: `document`, `scheme`, `office`, `official`, `application` | Conversational purpose |
| `english` | String | English translation |
| `hindi` | Devanagari String | Hindi translation |
| `kangdi` | Devanagari String | Kangdi dialect translation |
| `pronunciation` | Simplified Romanized (SDPS) | Romanized pronunciation guide |
| `verified` | `true` | Checked by a native speaker |
| `source` | `native_speaker` | Core source |
| `license` | `CC-BY-4.0` | Default open-source usage terms |
