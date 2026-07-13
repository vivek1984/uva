<?php

namespace App\Mail;

use App\Models\Requirement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewRequirementNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Requirement $requirement)
    {
    }

    public function build()
    {
        return $this
            ->subject('New requirement posted on UVA')
            ->view('mail.new-requirement', [
                'name'         => $this->requirement->name,
                'address'      => $this->requirement->address,
                'phoneNumber'  => $this->requirement->phone_number,
                'details'      => $this->requirement->details,
                'submittedAt'  => $this->requirement->created_at->format('d M Y, h:i A'),
            ]);
    }
}
