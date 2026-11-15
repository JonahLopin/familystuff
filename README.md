# Family Stuff

A small family site, password protected.

**Live site:** https://jonahlopin.github.io/familystuff/

## What's inside

- **Greger on Eggs** (`/eggs/`): what Dr. Michael Greger says about eggs on NutritionFacts.org, a skeptical doctor's check of all 175 studies he cites, and the strongest reply from his side (written by Claude, not Dr. Greger's words). Not affiliated with Dr. Greger or NutritionFacts.org.
- **Couch for the living room** (`/couch/`): a shortlist of sectionals that fit the living room's back-wall corner, each drawn to scale in the room.
- **Burt · Oak Hill Academics:** a link to the Oak Hill page on the separate bl-profile site, which has its own password.

## How it works

Every page is encrypted (AES-GCM, key from PBKDF2) and the browser decrypts it once the right password is typed. The readable pages live in `src/`, which is kept out of git. After editing them, run `node encrypt.mjs <password>` to rebuild the published pages.
