# DevelopersConnect User Manual

This guide explains exactly how to run the project locally.

![User manual cover](./docs/user-manual-images/00-cover.jpg)

## 1. System Requirements

- Windows 10/11, macOS, or Linux
- Node.js `20.x` or newer
- npm `10.x` or newer
- Git
- Internet connection (required for Supabase auth/API)

Picture:

![System requirements check](./docs/user-manual-images/01-system-requirements.png)

## 2. Open the Project Folder

If you already have the project, open a terminal in:

`D:\My Files\Projects\developersconnect`

If you need to clone it first:

```powershell
git clone <YOUR_REPOSITORY_URL>
cd developersconnect
```

Picture:

![Open project folder](./docs/user-manual-images/02-open-project-folder.png)

## 3. Create Environment File

Create or verify `.env.local` in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jlrgrfhmxyrytimdwclj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Notes:
- Use your own Supabase anon key.
- Do not expose service role keys in frontend env files.

Picture:

![Create env local file](./docs/user-manual-images/03-env-local.png)

## 4. Install Dependencies

Run:

```powershell
npm install
```

Wait until installation completes without errors.

Picture:

![npm install success](./docs/user-manual-images/04-npm-install.png)

## 5. Start Development Server

Run:

```powershell
npm run dev
```

Expected terminal output should include a local URL like:

`http://localhost:3000`

Picture:

![npm run dev output](./docs/user-manual-images/05-dev-server-running.png)

## 6. Open the App in Browser

Open:

`http://localhost:3000`

You should see the DevelopersConnect home/landing page.

Picture:

![Landing page](./docs/user-manual-images/06-landing-page.png)

## 7. Test Basic App Flow

- Click Sign In / Get Started
- Authenticate (Google or Email, based on project setup)
- Verify dashboard/feed loads
- Create one sample post (if enabled)

Picture:

![Basic app flow check](./docs/user-manual-images/07-basic-flow.png)

## 8. Optional Production Build Check

To verify production build:

```powershell
npm run build
npm run start
```

Then open `http://localhost:3000` again.

Picture:

![Production build check](./docs/user-manual-images/08-production-check.png)

## 9. Troubleshooting

### Port 3000 already in use

Use another port:

```powershell
npm run dev -- -p 3001
```

### Environment variable error

- Re-check `.env.local` name and location (project root)
- Restart the dev server after editing `.env.local`

### Package install issues

Try:

```powershell
npm cache clean --force
npm install
```

## 10. Screenshot Checklist (For Report Submission)

Capture and place images in `docs/user-manual-images/` with these exact names:

1. `01-system-requirements.png`
2. `02-open-project-folder.png`
3. `03-env-local.png`
4. `04-npm-install.png`
5. `05-dev-server-running.png`
6. `06-landing-page.png`
7. `07-basic-flow.png`
8. `08-production-check.png`

Once these images are added, this manual is ready for direct use in your report.
