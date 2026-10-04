# Finish Classroom Resource Hub

## Already done
- Backend: profiles, roles (student/teacher), resources (10 sample items), bookmarks, downloads, AI chats, private file storage, email + Google sign-in.
- Teal/mint design system, fonts, bottom navigation, resource cards with View / Download / Bookmark, skeletons, empty states.
- Secure AI assistant function (explain, simplify, quiz, important questions, examples, Telugu/English).

## Remaining screens
1. **Welcome (/)** – splash that sends signed-in users to Home, others to sign in.
2. **Sign in / Sign up** – Student or Teacher picker, name, class, school, email, password, Google button.
3. **Home** – greeting, notification bell, search bar, class chips, subject cards, Recently Added, Popular. Teachers also see a dashboard card.
4. **Notifications** – built from the latest uploads ("New Science notes uploaded", etc.).
5. **Resources** – search plus Class / Subject / Type filters (filters accept links from Home).
6. **Resource viewer** – details, preview (PDF/image inline, others as a document card), Download, Bookmark; teacher owners get Edit / Delete.
7. **AI Chat** – WhatsApp-style bubbles, welcome message, suggestion chips, typing indicator, new chat, chat history drawer, saved automatically.
8. **Teacher dashboard** – Total Resources, Recent Uploads, Total Downloads, large Upload button, list with View / Edit / Delete.
9. **Upload / Edit resource** – title, description, class, subject, type, file (PDF, PPT/PPTX, DOC/DOCX, images), Publish button; appears instantly for students.
10. **Profile** – avatar, name, class, school, tabs for Saved, Downloaded, Recent AI Chats, Edit Profile dialog, Logout.

## Technical details
- Root: font links, AuthProvider, Toaster, app-specific head meta.
- Protected screens under `_authenticated/` (client-only gate redirecting to /auth) wrapped in AppShell.
- Routes: home, notifications, resources, resources.$id, chat (?id), teacher, upload (?edit), profile.
- Teacher-only routes redirect students to Home; storage/table policies already enforce teacher-only writes.
- Files stored under `<teacherId>/...`, opened via short-lived signed links.
- Verify with a signed-in browser run: browse, bookmark, chat, teacher upload.
