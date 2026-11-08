# Put your live message website online (free, ~5 minutes)

You need 3 files in one folder: `server.js`, `package.json`, and this guide.

## 1. Put the files on GitHub
1. Make a free account at https://github.com
2. Click **New repository**, name it `live-messages`, create it.
3. Click **uploading an existing file**, drag in `server.js` and `package.json`, then **Commit changes**.

## 2. Deploy on Render
1. Make a free account at https://render.com (sign in with GitHub).
2. Click **New +** > **Web Service** and pick your `live-messages` repo.
3. Settings:
   - **Runtime:** Node
   - **Build Command:** leave empty (or `npm install`)
   - **Start Command:** `npm start`
   - **Instance type:** Free
4. Under **Environment**, add a variable:
   - Key: `ADMIN_PASSWORD`
   - Value: a password only you know
5. Click **Create Web Service**. After a minute you get a link like `https://live-messages-abcd.onrender.com`.

## 3. Use it
- Open that link in your browser. Enter your password and a message, then press Send.
- In Unity, set **Server Url** on `LiveMessageClient` to that same link (it must start with `https://`).

## Good to know
- Render's free plan puts the server to sleep after ~15 minutes of no traffic. The first request afterwards takes about 30 seconds. Open your link before you start sending, or pay for an always-on plan.
- Messages are only held in memory, so the latest message disappears if the server restarts. That's fine for live announcements.
- Test it: open `https://YOUR-LINK/latest` in a browser. You should see JSON like `{"id":0,"text":"","duration":6}`.
