## Usage

### 1. Set Up Environment Variables

- Copy the `.env.example` file and rename it to `.env`.
- Fill in the necessary details:
    - Node information.
    - LLM key.
    - Twitter credentials.

### 2. Customize DKG Knowledge Asset & Query Templates

- Modify the templates in `plugin-dkg/constants.ts` if you need to change the ontology or data format used in the Knowledge Graph.

### 3. Create a Character and Run the Agent

- Create a character file in the `characters` folder.
- Run the character using the following command:
    ```bash
    pnpm start --characters="characters/chatdkg.character.json"
    ```

### Notes

- There is no need to manually add `plugin-dkg` to the `plugins` array; it will load automatically.
- Ensure you configure the Twitter client and select your LLM provider in the character settings.
