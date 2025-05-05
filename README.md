Nfactorial Task

About the project:
ExpenseTrackerBot Project
Developed by Yeldar Azhbenov, this Telegram bot, @Expenses1Management_bot, launches a mini app for managing personal finances. Users can add and delete expenses (in tg currency), track daily and monthly spending, and analyze spending by category with a chart and table. Hosted on GitHub Pages, the app uses browser storage for data persistence, blending cultural inspiration with modern tech to promote financial awareness.

How to launch it:
Use telegram to launch this bot and mini app through the link: https://t.me/Expenses1Management_bot

Methodology:
To enhance the project's uniqueness and usability from the start, I utilized the aiogram library to develop both the Telegram bot and its mini app. Expenses are sensitive data, so I chose these technologies to prioritize user privacy while bringing my vision to life. Given the time constraints, I focused on implementing essential features first, with plans to add more advanced functionalities in future updates.

limitations:

Local Storage Limitation: The mini app uses browser localStorage for data persistence, meaning expenses are tied to the user’s device and browser. If the user clears their browser data, switches devices, or uses incognito mode, all data is lost. There’s no cloud backup or server-side storage to sync data across devices.

No User Authentication: The app lacks user authentication, so multiple users on the same device share the same expense data. There’s no way to differentiate or secure individual user data, which could lead to privacy issues.

Deployment:
The website component of the project is hosted on GitHub Pages, while the bot script, which handles requests, runs on Railway. This approach was chosen to minimize personal expenses and avoid unnecessary costs during development. Bot part was launched on private branch to avoid TOKEN leak, if you are from nfactorial judge panel, i can provide source code without the TOKEN.

To use this project use the link above!!!!

