<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#f8fafc; margin:0; padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background:#4338ca; padding:24px 32px;">
                            <span style="color:#ffffff; font-size:18px; font-weight:700;">UVA Vyapari Welfare Association</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="font-size:16px; color:#1e293b; margin:0 0 4px;">A new requirement has been posted on UVA.</p>
                            <p style="font-size:12px; color:#94a3b8; margin:0 0 20px;">Submitted {{ $submittedAt }}</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border-radius:12px; margin:0 0 24px;">
                                <tr>
                                    <td style="padding:16px 20px;">
                                        <p style="font-size:14px; color:#1e293b; margin:0 0 8px;"><strong>Name:</strong> {{ $name }}</p>
                                        <p style="font-size:14px; color:#1e293b; margin:0 0 8px;"><strong>Address:</strong> {{ $address }}</p>
                                        <p style="font-size:14px; color:#1e293b; margin:0 0 12px;"><strong>Phone:</strong> {{ $phoneNumber }}</p>
                                        <p style="font-size:14px; color:#1e293b; margin:0;"><strong>Requirement:</strong></p>
                                        <p style="font-size:14px; color:#334155; margin:4px 0 0; white-space:pre-wrap;">{{ $details }}</p>
                                    </td>
                                </tr>
                            </table>

                            <a href="{{ url('/admin/dashboard') }}" style="display:inline-block; background:#4f46e5; color:#ffffff; text-decoration:none; font-weight:600; font-size:14px; padding:12px 24px; border-radius:10px;">
                                Go to Dashboard
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
