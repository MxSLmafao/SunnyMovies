# Password Configuration

## Managing Passwords

Passwords for the movie streaming application are managed through the `passwords.json` file in the root directory.

### Adding New Passwords

1. Open `passwords.json`
2. Add new passwords to the `passwords` array
3. Save the file
4. Restart the application for changes to take effect

### Example Configuration

```json
{
  "passwords": [
    "movie123",
    "streaming456",
    "cinema789",
    "family2024",
    "premium_user"
  ]
}
```

### Password Rules

- Each password must be unique
- Passwords are case-sensitive
- Each password gets locked to the first browser that uses it
- If someone tries to use the same password from a different browser, they will be blocked

### Default Passwords

If the `passwords.json` file is missing or corrupted, the system will use these default passwords:
- `admin123`
- `user456`

### Security Notes

- Keep the `passwords.json` file secure and don't share it publicly
- Consider using strong, unique passwords
- Each password can only be used by one browser at a time to prevent sharing
- Users can logout and login again from the same browser without issues