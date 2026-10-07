🚀 Space Legacy
Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars
An interactive storybook and "museum with no roof" that introduces school-age space enthusiasts (ages 8–14) to the hardware NASA has left on the Moon, on Mars, and in deep space, and to the science that hardware made possible.
Built for the NASA Space Apps Challenge.
________________________________________
🌌 About the Project
Since the 1960s, NASA has left hardware across the solar system. Some machines finished their missions, some went silent, and some are still traveling away from Earth. Space Legacy tells their stories in a kid-friendly way: each machine gets its own profile, a first-person "Letter from..." narration, the science it enabled, and a quick quiz.
The goal is to show that these machines are abandoned, but not forgotten, and that their discoveries still help future missions.
✨ Features
•	Landing page with an animated deep-space hero
•	Interactive solar system map with clickable hardware hotspots (Moon, Mars, Deep Space) and status badges
•	Hardware profile pages with a consistent story template: meet the machine, its mission, big discoveries, its ending, why it matters today, and a quick activity
•	"Letters from..." first-person narration, clearly separated from verified facts, with read-aloud support
•	Timeline from the 1960s to today
•	Where are they now? status board for deep-space craft (distance, signal travel time, status)
•	Science Corner with interactive explainers and a Myth or Fact mini-game
•	Quizzes, badges, and a printable certificate

•	User accounts and profile to save progress, badges, and favorites
•	Light and dark themes, glossary tooltips, and accessibility options (keyboard navigation, text-size toggle, reduced motion)
•	Credits page listing all NASA sources and image credits
🛠️ Tech Stack
•	TanStack Start (React + Vite + TypeScript)
•	Tailwind CSS
•	Framer Motion
•	Lovable Cloud for authentication and data storage
📦 Getting Started
Prerequisites
•	Node.js (LTS version recommended)
•	npm (comes with Node.js)
Installation
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git

# 2. Go into the project folder
cd <your-repo-name>

# 3. Install dependencies
npm install

# 4. Create your environment file (see below)

# 5. Start the development server
npm run dev
Then open http://localhost:8080 in your browser.
Environment Variables
Create a .env file in the project root and add your own backend values:
VITE_SUPABASE_URL=your_backend_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_public_key
The exact variable names may differ in your project. Check your existing .env file or backend settings. Never commit private keys or secrets to GitHub.
Build for Production
npm run build
📁 Project Structure
src/
├── routes/        # Pages (home, map, hardware profiles, timeline, science, badges, profile, login, credits)
├── components/    # Reusable UI components
├── content/       # Typed content files (hardware, timeline, glossary, quizzes)
├── lib/           # Helpers and providers (auth, favorites, storage)
└── ...
Adjust this section to match your actual folders.
✏️ Editing Content
Most of the story content lives in typed data files inside src/content/. To change a profile, quiz question, or timeline event, edit the matching file and keep the commas, brackets, and quotation marks intact.
🛰️ Data and Credits
•	Images, facts, and mission information come from NASA's public resources, such as the NASA Image and Video Library, NASA mission pages, and NASA's Eyes on the Solar System.
•	NASA media is used with credit to NASA. See the Credits page in the app for the full list of sources.
•	This project is not endorsed by or affiliated with NASA. The use of NASA materials does not imply endorsement.
⚠️ Accuracy Note
Mission statuses, distances, and dates (for example, the distance of Voyager 1 from Earth) change over time. Values shown in the app are estimates based on a dated reference. Always check NASA's official pages for the latest numbers.
♿ Accessibility
•	Keyboard navigation and visible focus states
•	Alt text for images and glossary tooltips for technical words
•	Reduced-motion and text-size options
•	Light and dark themes
👥 Team
Name
Nahidul Islam
Akifa Jahan Odry
Irtiza Khan
Mahfaj Ahmed
Md Saymun
Meherin Afroj

🏆 NASA Space Apps Challenge
•	Challenge: Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars
•	Team name: Add your team name
•	Demo video: Add link
•	Live site: Add link
📄 License
Add your license here (for example, MIT). If you are unsure, see choosealicense.com.
🙏 Acknowledgements
Thank you to NASA for its open data and imagery, to the NASA Space Apps Challenge organizers, and to every machine that kept exploring long after its mission plan ended.
________________________________________
Abandoned, but never forgotten.

