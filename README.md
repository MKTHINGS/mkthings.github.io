# Fast Speedtest Clone

A multilingual clone of Netflix's [fast.com](https://fast.com) internet speed test with support for English and Italian languages.

![Fast.com Clone Screenshot](https://www.tecmint.com/wp-content/uploads/2019/05/Test-Internet-Download-Speed.png)

## Features

- Clean, minimalist design similar to the original fast.com
- Automatic internet speed testing
- Display of download speed, upload speed, and latency metrics
- Language switching between English and Italian
- Responsive design that works on mobile, tablet, and desktop devices
- Accessibility features for better usability

## Screenshots

### Desktop View
![Desktop View](https://techau.com.au/wp-content/uploads/2018/07/Fastdotcom.jpg)

### Mobile View
![Mobile View](https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/be/f4/f9/bef4f91b-7113-f6b1-eba1-2895a3070072/pr_source.png/300x0w.jpg)

### Expanded View with Additional Metrics
![Expanded View](https://www.ghacks.net/wp-content/uploads/2018/07/fast-com-internet-speed-test.png)

## Project Structure

```
project/
├── index.html                # Main HTML file
├── css/                      # CSS stylesheets
│   └── style.css             # Main stylesheet
├── js/                       # JavaScript files
│   ├── speedtest.js          # Core speed testing functionality
│   └── language.js           # Language switching functionality
├── assets/                   # Static assets
│   └── images/               # Images and icons
├── locales/                  # Language files
│   ├── en.json               # English translations
│   └── it.json               # Italian translations
└── README.md                 # This documentation file
```

## How It Works

### Speed Testing

The application simulates internet speed testing by:
1. Measuring initial unloaded latency
2. Testing download speed
3. Testing upload speed
4. Measuring loaded latency (with network traffic)

The speed test starts automatically when the page loads and displays the results in real-time.

### Language Switching

The application supports multiple languages:
- Automatically detects the user's browser language
- Allows manual language switching via the language selector
- Stores language preference in local storage
- Updates all UI elements when language is changed

## Technical Implementation

### HTML Structure
The application uses semantic HTML5 elements to create a clean, accessible interface:
- Header section with logo and language selector
- Main content area with speed test display
- Additional metrics section (hidden by default)
- Footer with attribution

### CSS Styling
The styling follows fast.com's minimalist approach:
- Clean, white background with Netflix red accents
- Responsive design using media queries
- Smooth animations and transitions
- Accessibility considerations (focus states, readable text)

### JavaScript Functionality
The application is powered by two main JavaScript modules:
- `speedtest.js`: Handles the speed testing simulation
- `language.js`: Manages language switching and localization

## Deployment Instructions for GitHub Pages

Follow these steps to deploy the Fast.com clone to GitHub Pages:

1. **Create a GitHub repository**

   Create a new repository on GitHub to host your project.

2. **Initialize Git in your project folder**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Connect your local repository to GitHub**

   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**

   - Go to your repository on GitHub
   - Click on "Settings"
   - In the left sidebar, click on "Pages" under "Code and automation"
   - Under "Build and deployment", select "Deploy from a branch"
   - Choose the "main" branch as the source
   - Click "Save"

5. **Access your deployed site**

   After a few minutes, your site will be available at:
   `https://yourusername.github.io/your-repo-name/`

### Custom Domain (Optional)

To use a custom domain with your GitHub Pages site:

1. **Add your custom domain in GitHub**
   - In your repository settings, under "Pages"
   - Enter your domain in the "Custom domain" field
   - Click "Save"

2. **Configure DNS settings**
   - For an apex domain (example.com), create A records pointing to GitHub Pages IP addresses
   - For a subdomain (www.example.com), create a CNAME record pointing to your GitHub Pages URL

3. **Verify your domain**
   - Follow GitHub's domain verification process to confirm ownership

## Local Development

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Open the project in a web server:
   - You can use Python's built-in server:
     ```bash
     python -m http.server
     ```
   - Or use any other local development server

3. Open your browser and navigate to `http://localhost:8000`

## Browser Compatibility

The Fast.com clone is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## GitHub Pages Limitations

When deploying to GitHub Pages, be aware of these limitations:
- Repository size limit: 1 GB
- Published site size limit: 1 GB
- Bandwidth limit: 100 GB per month
- Build limit: 10 builds per hour (can be bypassed with custom GitHub Actions)

## Multilingual Support

The application currently supports two languages:
- English (en)
- Italian (it)

To add additional languages:
1. Create a new JSON file in the `locales` folder (e.g., `fr.json`)
2. Copy the structure from an existing language file
3. Translate all values to the new language
4. Add the language option to the language selector in `index.html`
5. Add the new language code to the `supportedLanguages` array in `language.js`

## License

This project is for educational purposes only. The original Fast.com is owned by Netflix.

## Acknowledgements

- Design inspired by [fast.com](https://fast.com)
- Icons and fonts from open-source libraries
- Screenshots used in this README are from the original Fast.com service for reference purposes