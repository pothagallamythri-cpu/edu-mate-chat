# Classroom Companion

Build a complete, modern, mobile-first web application called “Classroom Resource Hub”.



The application should feel like a REAL MOBILE APP, similar to the clean and simple user experience of WhatsApp or Google Classroom. Do NOT make it look like a normal website, PDF, dashboard template, or college presentation.



PURPOSE



Classroom Resource Hub is a platform where students can easily access classroom learning materials and communicate with an AI learning assistant. Teachers should be able to upload and manage classroom resources.



USER TYPES



Create two roles:



1. Student

2. Teacher



Add a clean login/signup page where users can select whether they are a Student or Teacher.



MOBILE APP DESIGN



Use a modern mobile-first UI.



Create a fixed bottom navigation bar with:



🏠 Home

💬 AI Chat

📚 Resources

👤 Profile



For teacher accounts, also provide access to:



➕ Add Resource



Use rounded cards, clean typography, subtle shadows, good spacing, smooth transitions, and simple icons.



Use an education-friendly color palette with green/teal as the primary color and a light background.



The app must be fully responsive on phones, tablets, and desktop.



1. HOME SCREEN



Create a welcoming home page.



At the top show:



“Good Morning 👋”

“Welcome to Classroom Hub”



Include a search bar:



“Search notes, subjects, resources...”



Below it show class filters:



Class 6

Class 7

Class 8

Class 9

Class 10



Then display subjects as attractive cards:



📐 Mathematics

🧪 Science

📖 English

💻 Computer Science

🌍 Social Studies



Also include:



Recently Added Resources



and



Popular Resources.



2. RESOURCES SCREEN



Students should be able to browse classroom resources.



Each resource card should display:



Resource title

Subject

Class

Teacher name

Resource type

Upload date



Support resources such as:



PDF notes

PPT presentations

Assignments

Question papers

Images

Study materials



Add filters for:



Class

Subject

Resource type



Add search functionality.



Each resource should have:



👁 View

⬇ Download



button.



Create a clean resource viewer page when a resource is selected.



3. AI CLASSROOM ASSISTANT



Create a WhatsApp/ChatGPT-style AI chat screen.



Header:



🤖 Classroom AI



Welcome message:



“Hi 👋 I’m your Classroom AI. Ask me anything about your lessons!”



Students should be able to type questions such as:



“Explain photosynthesis.”



“Explain photosynthesis in Telugu.”



“Give me important questions from this topic.”



“Explain this in simple words.”



“Give me an example.”



“Create a quiz on DBMS.”



Display student messages on the right and AI messages on the left.



Add:



Message input

Send button

New chat option

Typing indicator

Chat history



Also show suggestion buttons when starting a new chat:



“Explain a topic”



“Create a quiz”



“Important questions”



“Explain in Telugu”



Design this section to feel like a real messaging application.



4. TEACHER DASHBOARD



Teachers should have a separate teacher interface.



Show:



Total Resources

Recent Uploads

Total Downloads



Add a large:



➕ Upload Resource



button.



Teacher should be able to enter:



Resource Title

Description

Class

Subject

Resource Type



and upload a file.



Supported files:



PDF

PPT/PPTX

DOC/DOCX

Images



Add a Publish Resource button.



After publishing, the resource should automatically appear in the student Resources section.



Teachers should also be able to:



Edit resource

Delete resource

View resource



5. STUDENT PROFILE



Create a clean profile screen.



Show:



Profile photo/avatar

Student name

Class

School/College



Also show:



Saved Resources

Downloaded Resources

Recent AI Chats



Add:



Edit Profile

Logout



buttons.



6. BOOKMARKS



Allow students to bookmark/save useful resources.



Add a bookmark icon to each resource.



Create a:



“Saved Resources”



section in the profile.



7. NOTIFICATIONS



Add a notification icon 🔔 on the Home screen.



Example notifications:



“New Science notes uploaded.”



“New Mathematics assignment available.”



“Your teacher uploaded a new resource.”



DATABASE



Use Supabase for the backend.



Create tables for:



profiles

resources

bookmarks

ai_chats



Use Supabase Authentication for signup/login.



Store uploaded classroom files using Supabase Storage.



Make sure students and teachers see the correct features based on their role.



AI INTEGRATION



Prepare the AI Classroom Assistant so it can be connected to an AI API.



Do NOT expose API keys in frontend code.



Use secure server-side/API functions for AI requests.



The AI assistant should be capable of:



Explaining topics

Simplifying difficult concepts

Generating quizzes

Generating important questions

Providing examples

Explaining content in Telugu or English



SAMPLE DATA



Populate the interface with realistic sample resources so the app does not look empty.



Examples:



“Photosynthesis Complete Notes”

Class 7 • Science



“Algebra Basics”

Class 7 • Mathematics



“Parts of Speech”

Class 6 • English



“Introduction to Computers”

Class 8 • Computer Science



“DBMS Important Questions”

Computer Science



IMPORTANT DESIGN REQUIREMENTS



The application must look polished and professional.



Prioritize MOBILE UI.



It should feel like an installable educational app rather than a traditional website.



Use:



Rounded cards

Modern icons

Smooth animations

Loading states

Empty states

Toast messages

Skeleton loaders



Do not overcrowd screens.



Keep navigation sBuild a complete, modern, mobile-first web application called “Classroom Resource Hub”.



The application should feel like a REAL MOBILE APP, similar to the clean and simple user experience of WhatsApp or Google Classroom. Do NOT make it look like a normal website, PDF, dashboard template, or college presentation.



PURPOSE



Classroom Resource Hub is a platform where students can easily access classroom learning materials and communicate with an AI learning assistant. Teachers should be able to upload and manage classroom resources.



USER TYPES



Create two roles:



1. Student

2. Teacher



Add a clean login/signup page where users can select whether they are a Student or Teacher.



MOBILE APP DESIGN



Use a modern mobile-first UI.



Create a fixed bottom navigation bar with:



🏠 Home

💬 AI Chat

📚 Resources

👤 Profile



For teacher accounts, also provide access to:



➕ Add Resource



Use rounded cards, clean typography, subtle shadows, good spacing, smooth transitions, and simple icons.



Use an education-friendly color palette with green/teal as the primary color and a light background.



The app must be fully responsive on phones, tablets, and desktop.



1. HOME SCREEN



Create a welcoming home page.



At the top show:



“Good Morning 👋”

“Welcome to Classroom Hub”



Include a search bar:



“Search notes, subjects, resources...”



Below it show class filters:



Class 6

Class 7

Class 8

Class 9

Class 10



Then display subjects as attractive cards:



📐 Mathematics

🧪 Science

📖 English

💻 Computer Science

🌍 Social Studies



Also include:



Recently Added Resources



and



Popular Resources.



2. RESOURCES SCREEN



Students should be able to browse classroom resources.



Each resource card should display:



Resource title

Subject

Class

Teacher name

Resource type

Upload date



Support resources such as:



PDF notes

PPT presentations

Assignments

Question papers

Images

Study materials



Add filters for:



Class

Subject

Resource type



Add search functionality.



Each resource should have:



👁 View

⬇ Download



button.



Create a clean resource viewer page when a resource is selected.



3. AI CLASSROOM ASSISTANT



Create a WhatsApp/ChatGPT-style AI chat screen.



Header:



🤖 Classroom AI



Welcome message:



“Hi 👋 I’m your Classroom AI. Ask me anything about your lessons!”



Students should be able to type questions such as:



“Explain photosynthesis.”



“Explain photosynthesis in Telugu.”



“Give me important questions from this topic.”



“Explain this in simple words.”



“Give me an example.”



“Create a quiz on DBMS.”



Display student messages on the right and AI messages on the left.



Add:



Message input

Send button

New chat option

Typing indicator

Chat history



Also show suggestion buttons when starting a new chat:



“Explain a topic”



“Create a quiz”



“Important questions”



“Explain in Telugu”



Design this section to feel like a real messaging application.



4. TEACHER DASHBOARD



Teachers should have a separate teacher interface.



Show:



Total Resources

Recent Uploads

Total Downloads



Add a large:



➕ Upload Resource



button.



Teacher should be able to enter:



Resource Title

Description

Class

Subject

Resource Type



and upload a file.



Supported files:



PDF

PPT/PPTX

DOC/DOCX

Images



Add a Publish Resource button.



After publishing, the resource should automatically appear in the student Resources section.



Teachers should also be able to:



Edit resource

Delete resource

View resource



5. STUDENT PROFILE



Create a clean profile screen.



Show:



Profile photo/avatar

Student name

Class

School/College



Also show:



Saved Resources

Downloaded Resources

Recent AI Chats



Add:



Edit Profile

Logout



buttons.



6. BOOKMARKS



Allow students to bookmark/save useful resources.



Add a bookmark icon to each resource.



Create a:



“Saved Resources”



section in the profile.



7. NOTIFICATIONS



Add a notification icon 🔔 on the Home screen.



Example notifications:



“New Science notes uploaded.”



“New Mathematics assignment available.”



“Your teacher uploaded a new resource.”



DATABASE



Use Supabase for the backend.



Create tables for:



profiles

resources

bookmarks

ai_chats



Use Supabase Authentication for signup/login.



Store uploaded classroom files using Supabase Storage.



Make sure students and teachers see the correct features based on their role.



AI INTEGRATION



Prepare the AI Classroom Assistant so it can be connected to an AI API.



Do NOT expose API keys in frontend code.



Use secure server-side/API functions for AI requests.



The AI assistant should be capable of:



Explaining topics

Simplifying difficult concepts

Generating quizzes

Generating important questions

Providing examples

Explaining content in Telugu or English



SAMPLE DATA



Populate the interface with realistic sample resources so the app does not look empty.



Examples:



“Photosynthesis Complete Notes”

Class 7 • Science



“Algebra Basics”

Class 7 • Mathematics



“Parts of Speech”

Class 6 • English



“Introduction to Computers”

Class 8 • Computer Science



“DBMS Important Questions”

Computer Science



IMPORTANT DESIGN REQUIREMENTS



The application must look polished and professional.



Prioritize MOBILE UI.



It should feel like an installable educational app rather than a traditional website.



Use:



Rounded cards

Modern icons

Smooth animations

Loading states

Empty states

Toast messages

Skeleton loaders



Do not overcrowd screens.



Keep navigation simple enough for school students.



Make every button functional.



Do not create placeholder buttons that do nothing.



Build reusable components and maintain clean project structure.



Start by creating the complete frontend and navigation, then connect authentication, database, resource uploads, bookmarks, and AI functionality.imple enough for school students.



Make every button functional.



Do not create placeholder buttons that do nothing.



Build reusable components and maintain clean project structure.



Start by creating the complete frontend and navigation, then connect authentication, database, resource uploads, bookmarks, and AI functionality.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://edu-mate-chat.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/64bceca8-39e6-41c4-8288-f5a9087f5a3d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
