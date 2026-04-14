# Node.js streaming client

```bash
npm install
LIVERATES_KEY=trial node index.js
```

Drops the `trial` key and uses `process.env.LIVERATES_KEY` if set. Expected first line:

```
{ info: 'Subscribing for 2 Minutes (Trial)' }
```

followed by rate objects every few hundred ms.
