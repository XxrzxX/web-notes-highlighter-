# Web Text Highlighter Extension

A browser extension that allows you to highlight text on web pages, organize highlights by categories, and export them for later use.

## Features

- 🎨 **Custom Colors**: Choose any color for your highlights
- 📂 **Categories**: Organize highlights (Important, Study, Quote, Reference, Todo)
- 💾 **Persistent Storage**: Highlights are saved and restored when you revisit pages
- 🔍 **Search & Filter**: Find highlights by text or category
- 📤 **Export**: Download all highlights as readable text file
- 🎯 **Easy Management**: Double-click highlights to change color or remove
- 🔒 **Privacy First**: All data stored locally, no external servers

## Installation

1. Download or clone this repository
2. Open your browser and go to `chrome://extensions/` (Chrome) or `brave://extensions/` (Brave)
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension is now installed and ready to use

## Usage

### Highlighting Text
1. Select any text on a webpage
2. Right-click and choose "Highlight as..." → Select category
3. Text is highlighted with your chosen color (semi-transparent)

### Managing Highlights
- **Change Color**: Double-click any highlight → Click color square
- **Remove**: Double-click any highlight → Click red X button
- **Set Default Color**: Click extension icon → Use color picker

### Viewing & Exporting
- **View All**: Click extension icon to see all highlights
- **Search**: Type in search box to find specific highlights
- **Filter**: Click category buttons to filter by type
- **Export**: Click "Export Highlights" to download as text file

## File Structure

```
web-notes-highlighter/
├── manifest.json          # Extension configuration
├── background.js          # Context menu handler
├── content.js            # Main highlighting functionality
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── styles.css            # Highlight styling
├── recover.html          # Data recovery tool
└── README.md             # This file
```

## Security Features

- Content Security Policy prevents code injection
- Input sanitization prevents XSS attacks
- Data validation ensures safe storage
- Local storage only - no external data transmission
- Minimal permissions requested

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Brave
- ✅ Edge
- ✅ Other Chromium-based browsers

## Privacy

This extension:
- Stores all data locally in your browser
- Does not send any data to external servers
- Does not track your browsing activity
- Only accesses pages where you actively use highlighting

## License

MIT License - Feel free to modify and distribute

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

If you encounter issues:
1. Check browser console for error messages
2. Try reloading the extension
3. Use the recovery tool (Extension options → Recovery)
4. Create an issue on GitHub
