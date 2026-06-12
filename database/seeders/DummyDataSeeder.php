<?php

namespace Database\Seeders;

use App\Models\Child;
use App\Models\ExecutiveAssignment;
use App\Models\MemberProfile;
use App\Models\Post;
use App\Models\User;
use App\Models\UserPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class DummyDataSeeder extends Seeder
{
    private array $executives = [
        ['name' => 'Ramesh Kumar Gupta',    'father' => 'Shyam Lal Gupta',     'firm' => 'Gupta Textiles & Co.',       'city' => 'Varanasi'],
        ['name' => 'Suresh Prasad Agarwal', 'father' => 'Mohan Das Agarwal',   'firm' => 'Agarwal Wholesale Mart',     'city' => 'Lucknow'],
        ['name' => 'Vijay Singh Yadav',     'father' => 'Ram Singh Yadav',     'firm' => 'Yadav Traders',              'city' => 'Kanpur'],
        ['name' => 'Mahesh Chandra Mishra', 'father' => 'Kedar Nath Mishra',   'firm' => 'Mishra & Sons Enterprises',  'city' => 'Allahabad'],
        ['name' => 'Dinesh Sharma',         'father' => 'Jagdish Sharma',      'firm' => 'Sharma Garment House',       'city' => 'Agra'],
        ['name' => 'Pankaj Verma',          'father' => 'Brijesh Verma',       'firm' => 'Verma Steel Corporation',    'city' => 'Meerut'],
        ['name' => 'Ashok Kumar Jain',      'father' => 'Prakash Chand Jain',  'firm' => 'Jain Jewellers & Co.',       'city' => 'Mathura'],
    ];

    private array $generalMembers = [
        ['name' => 'Ravi Shankar Tiwari',     'father' => 'Vishnu Prasad Tiwari',   'firm' => 'Tiwari Hardware Store',         'city' => 'Varanasi'],
        ['name' => 'Santosh Kumar Singh',     'father' => 'Raghunath Singh',        'firm' => 'Singh Provisions',              'city' => 'Lucknow'],
        ['name' => 'Anand Prakash Dubey',     'father' => 'Shiv Kumar Dubey',       'firm' => 'Dubey Electronics',             'city' => 'Gorakhpur'],
        ['name' => 'Narendra Pal Gupta',      'father' => 'Kailash Nath Gupta',     'firm' => 'Gupta Medical Store',           'city' => 'Varanasi'],
        ['name' => 'Pramod Kumar Sharma',     'father' => 'Heera Lal Sharma',       'firm' => 'Sharma Stationery',             'city' => 'Kanpur'],
        ['name' => 'Kuldeep Singh',           'father' => 'Ajit Singh',             'firm' => 'Singh Transport Services',      'city' => 'Agra'],
        ['name' => 'Deepak Agarwal',          'father' => 'Ramesh Chand Agarwal',   'firm' => 'Agarwal Flour Mill',            'city' => 'Allahabad'],
        ['name' => 'Sanjay Kumar Pandey',     'father' => 'Suresh Pandey',          'firm' => 'Pandey Kirana Store',           'city' => 'Meerut'],
        ['name' => 'Rakesh Verma',            'father' => 'Gyaan Prakash Verma',    'firm' => 'Verma Auto Parts',              'city' => 'Bareilly'],
        ['name' => 'Hemant Kumar Yadav',      'father' => 'Bhola Nath Yadav',       'firm' => 'Yadav Dairy Products',          'city' => 'Mathura'],
        ['name' => 'Ajay Kumar Mishra',       'father' => 'Deen Dayal Mishra',      'firm' => 'Mishra Cloth House',            'city' => 'Varanasi'],
        ['name' => 'Vinod Kumar Saxena',      'father' => 'Hari Shankar Saxena',    'firm' => 'Saxena Furniture Works',        'city' => 'Lucknow'],
        ['name' => 'Manoj Kumar Rastogi',     'father' => 'Nand Kishore Rastogi',   'firm' => 'Rastogi Electrical',            'city' => 'Kanpur'],
        ['name' => 'Sunil Kumar Tripathi',    'father' => 'Govind Prasad Tripathi', 'firm' => 'Tripathi Saree Center',         'city' => 'Varanasi'],
        ['name' => 'Arun Kumar Srivastava',   'father' => 'Chandra Bhan Srivastava','firm' => 'Srivastava Book Depot',         'city' => 'Allahabad'],
        ['name' => 'Rajesh Kumar Chaurasia',  'father' => 'Ram Babu Chaurasia',     'firm' => 'Chaurasia Sweet Shop',          'city' => 'Gorakhpur'],
        ['name' => 'Ganesh Prasad Maurya',    'father' => 'Ram Prasad Maurya',      'firm' => 'Maurya Building Materials',     'city' => 'Varanasi'],
        ['name' => 'Shyam Sundar Kesarwani',  'father' => 'Moti Lal Kesarwani',    'firm' => 'Kesarwani Rice Mill',           'city' => 'Allahabad'],
        ['name' => 'Umesh Kumar Singh',       'father' => 'Lal Bahadur Singh',      'firm' => 'Singh General Store',           'city' => 'Meerut'],
        ['name' => 'Dharmendra Kumar Shukla', 'father' => 'Omkar Nath Shukla',     'firm' => 'Shukla Photography Studio',     'city' => 'Lucknow'],
        ['name' => 'Vikas Kumar Garg',        'father' => 'Ramesh Kumar Garg',      'firm' => 'Garg Plastics',                 'city' => 'Agra'],
        ['name' => 'Pradeep Kumar Jaiswal',   'father' => 'Jagdish Prasad Jaiswal', 'firm' => 'Jaiswal Iron Works',            'city' => 'Varanasi'],
        ['name' => 'Mukesh Kumar Keshari',    'father' => 'Shiv Nandan Keshari',    'firm' => 'Keshari Lubricants',            'city' => 'Kanpur'],
        ['name' => 'Sushil Kumar Pathak',     'father' => 'Brij Nath Pathak',       'firm' => 'Pathak & Sons Traders',         'city' => 'Bareilly'],
        ['name' => 'Ramakant Gupta',          'father' => 'Phool Chand Gupta',      'firm' => 'Gupta Colour House',            'city' => 'Mathura'],
        ['name' => 'Harish Chandra Pal',      'father' => 'Dinesh Pal',             'firm' => 'Pal Cycle Store',               'city' => 'Varanasi'],
        ['name' => 'Brijesh Kumar Tiwari',    'father' => 'Madan Mohan Tiwari',     'firm' => 'Tiwari Chemical Works',         'city' => 'Lucknow'],
        ['name' => 'Alok Kumar Bajpai',       'father' => 'Suresh Chandra Bajpai',  'firm' => 'Bajpai Glass Works',            'city' => 'Kanpur'],
        ['name' => 'Devendra Kumar Patel',    'father' => 'Rameshwar Patel',        'firm' => 'Patel Seeds Agency',            'city' => 'Allahabad'],
        ['name' => 'Shailendra Nath Upadhyay','father' => 'Ganga Prasad Upadhyay',  'firm' => 'Upadhyay Footwear',             'city' => 'Gorakhpur'],
        ['name' => 'Kapil Dev Soni',          'father' => 'Manohar Lal Soni',       'firm' => 'Soni Jewel Works',              'city' => 'Agra'],
        ['name' => 'Naresh Kumar Bind',       'father' => 'Ram Adhar Bind',         'firm' => 'Bind Pottery & Crafts',         'city' => 'Varanasi'],
        ['name' => 'Santosh Kumar Yadav',     'father' => 'Virendra Yadav',         'firm' => 'Yadav Motor Garage',            'city' => 'Mathura'],
        ['name' => 'Anil Kumar Chaudhary',    'father' => 'Satish Chaudhary',       'firm' => 'Chaudhary Electronics Zone',    'city' => 'Meerut'],
        ['name' => 'Girish Kumar Sahu',       'father' => 'Thakur Prasad Sahu',     'firm' => 'Sahu Oil Mill',                 'city' => 'Varanasi'],
        ['name' => 'Yogesh Kumar Prajapati',  'father' => 'Ramesh Prajapati',       'firm' => 'Prajapati Ceramics',            'city' => 'Lucknow'],
        ['name' => 'Suresh Chandra Nishad',   'father' => 'Balram Nishad',          'firm' => 'Nishad Fish Market',            'city' => 'Allahabad'],
        ['name' => 'Radheshyam Kesarwani',    'father' => 'Ram Kishore Kesarwani',  'firm' => 'Kesarwani Dry Fruits',          'city' => 'Varanasi'],
        ['name' => 'Arvind Kumar Dixit',      'father' => 'Om Prakash Dixit',       'firm' => 'Dixit Sanitary Mart',           'city' => 'Kanpur'],
        ['name' => 'Gopal Prasad Gupta',      'father' => 'Shiv Prasad Gupta',      'firm' => 'Gupta Readymade Garments',      'city' => 'Agra'],
        ['name' => 'Hemraj Singh',            'father' => 'Balwant Singh',          'firm' => 'Singh Agro Industries',         'city' => 'Bareilly'],
        ['name' => 'Kailash Nath Tripathi',   'father' => 'Brijmohan Tripathi',     'firm' => 'Tripathi Travel Agency',        'city' => 'Varanasi'],
        ['name' => 'Jagdish Prasad Sonkar',   'father' => 'Babulal Sonkar',         'firm' => 'Sonkar Leather Works',          'city' => 'Kanpur'],
        ['name' => 'Shivendra Pratap Singh',  'father' => 'Surendra Singh',         'firm' => 'Singh Construction Co.',        'city' => 'Lucknow'],
        ['name' => 'Tribhuvan Nath Rai',      'father' => 'Sitaram Rai',            'firm' => 'Rai Paper Agency',              'city' => 'Allahabad'],
        ['name' => 'Chandrakant Mishra',      'father' => 'Shyam Bihari Mishra',    'firm' => 'Mishra Bakery',                 'city' => 'Gorakhpur'],
        ['name' => 'Bharat Kumar Awasthi',    'father' => 'Surendra Awasthi',       'firm' => 'Awasthi Finance Services',      'city' => 'Varanasi'],
        ['name' => 'Satendra Kumar Maurya',   'father' => 'Jagannath Maurya',       'firm' => 'Maurya Paints & Hardware',      'city' => 'Meerut'],
        ['name' => 'Virendra Kumar Rawat',    'father' => 'Tej Bahadur Rawat',      'firm' => 'Rawat Cold Storage',            'city' => 'Mathura'],
        ['name' => 'Ashutosh Kumar Pandey',   'father' => 'Ramsevak Pandey',        'firm' => 'Pandey Courier Services',       'city' => 'Varanasi'],
        ['name' => 'Umakant Sharma',          'father' => 'Balkrishna Sharma',      'firm' => 'Sharma Optical House',          'city' => 'Agra'],
    ];

    private array $spouseNames = [
        'Sunita', 'Kavita', 'Anita', 'Rekha', 'Sushma', 'Meena', 'Geeta', 'Kiran',
        'Pushpa', 'Asha', 'Usha', 'Poonam', 'Seema', 'Neeta', 'Reena', 'Savita',
        'Mamta', 'Nirmala', 'Shobha', 'Beena', 'Sarita', 'Manju', 'Suman', 'Lata',
        'Shanti', 'Kamla', 'Vimla', 'Radha', 'Sheela', 'Pratima',
    ];

    private array $childNames = [
        'male'   => ['Aditya', 'Rohit', 'Rahul', 'Vikas', 'Ankit', 'Akash', 'Nikhil', 'Sumit', 'Kunal', 'Vivek', 'Arjun', 'Rishabh', 'Kartik', 'Mohit', 'Tushar'],
        'female' => ['Priya', 'Pooja', 'Sneha', 'Rani', 'Nisha', 'Ritu', 'Deepa', 'Shweta', 'Ankita', 'Divya', 'Komal', 'Simran', 'Aarti', 'Neha', 'Muskan'],
    ];

    private array $services = [
        'Wholesale distribution of textiles and fabrics',
        'Retail sale of garments and readymade clothes',
        'Hardware and building materials supply',
        'Electronics repair and retail',
        'Medical equipment and pharmaceuticals',
        'Agricultural seeds and fertilizers distribution',
        'Iron and steel trading',
        'Jewellery manufacturing and retail',
        'Transport and logistics services',
        'Furniture manufacturing and sales',
        'Auto parts and accessories',
        'Electrical goods and fittings',
        'Food processing and distribution',
        'Chemical trading and supply',
        'Construction materials wholesale',
    ];

    public function run(): void
    {
        $this->createPhotoDirectory();

        $posts      = Post::all()->keyBy('name');
        $postNames  = ['Chairman', 'Vice Chairman', 'Secretary', 'Joint Secretary', 'Treasurer', 'President', 'Vice President'];

        // --- Executive members ---
        $executiveUsers = [];
        foreach ($this->executives as $i => $data) {
            $phone = '98' . str_pad((string)(10000000 + $i), 8, '0', STR_PAD_LEFT);

            $user = User::create([
                'name'         => $data['name'],
                'phone_number' => $phone,
                'email'        => $this->nameToEmail($data['name'], 'exec'),
                'password'     => Hash::make('exec@123'),
                'role'         => 'executive',
                'email_verified_at' => now(),
            ]);

            $this->createProfile($user, $data, 'executive', $i);

            // Assign post (7 executives, 7 posts)
            if (isset($postNames[$i]) && isset($posts[$postNames[$i]])) {
                UserPost::create([
                    'user_id' => $user->id,
                    'post_id' => $posts[$postNames[$i]]->id,
                ]);
            }

            $executiveUsers[] = $user;
        }

        // --- General members ---
        $generalUsers = [];
        foreach ($this->generalMembers as $i => $data) {
            $phone = '97' . str_pad((string)(10000000 + $i), 8, '0', STR_PAD_LEFT);

            $user = User::create([
                'name'         => $data['name'],
                'phone_number' => $phone,
                'email'        => ($i % 3 === 0) ? $this->nameToEmail($data['name'], 'gen') : null,
                'password'     => Hash::make('member@123'),
                'role'         => 'general',
                'email_verified_at' => now(),
            ]);

            $this->createProfile($user, $data, 'general', $i);

            $generalUsers[] = $user;
        }

        // Assign ~7-8 general members per executive
        $chunks = array_chunk($generalUsers, (int)ceil(count($generalUsers) / count($executiveUsers)));
        foreach ($executiveUsers as $idx => $exec) {
            foreach ($chunks[$idx] ?? [] as $general) {
                ExecutiveAssignment::create([
                    'executive_id'     => $exec->id,
                    'general_member_id' => $general->id,
                ]);
            }
        }
    }

    private function createProfile(User $user, array $data, string $role, int $index): void
    {
        $isMarried     = $index % 5 !== 4; // 80% married
        $numChildren   = $isMarried ? ($index % 4) : 0; // 0–3 children
        $dob           = now()->subYears(rand(32, 58))->subDays(rand(0, 365))->format('Y-m-d');
        $spouseDob     = $isMarried ? now()->subYears(rand(28, 52))->subDays(rand(0, 365))->format('Y-m-d') : null;
        $anniversary   = $isMarried ? now()->subYears(rand(3, 25))->subDays(rand(0, 365))->format('Y-m-d') : null;
        $nature        = ['wholesale', 'retail', 'both'][$index % 3];
        $spouseName    = $isMarried ? $this->spouseNames[$index % count($this->spouseNames)] : null;
        $spousePhone   = $isMarried ? '96' . str_pad((string)(10000000 + $index), 8, '0', STR_PAD_LEFT) : null;

        $photoPath = $this->downloadAvatar($data['name'], $index, $role === 'executive' ? 'exec' : 'general');

        $profile = MemberProfile::create([
            'user_id'              => $user->id,
            'photo'                => $photoPath,
            'father_husband_name'  => $data['father'],
            'firm_name'            => $data['firm'],
            'firm_address'         => $data['firm'] . ', ' . $data['city'] . ', Uttar Pradesh',
            'phone_number'         => $user->phone_number,
            'whatsapp_number'      => $user->phone_number,
            'email'                => $user->email,
            'nature_of_business'   => $nature,
            'business_services'    => $this->services[$index % count($this->services)],
            'residential_address'  => rand(1, 200) . ', ' . $this->randomMohalla() . ', ' . $data['city'] . ', UP - ' . rand(200001, 285001),
            'is_married'           => $isMarried,
            'spouse_name'          => $spouseName,
            'spouse_phone_number'  => $spousePhone,
            'date_of_birth'        => $dob,
            'spouse_date_of_birth' => $spouseDob,
            'anniversary_date'     => $anniversary,
            'number_of_children'   => $numChildren,
        ]);

        for ($c = 0; $c < $numChildren; $c++) {
            $gender   = ($c % 2 === 0) ? 'male' : 'female';
            $names    = $this->childNames[$gender];
            $childDob = now()->subYears(rand(2, 18))->subDays(rand(0, 365))->format('Y-m-d');

            Child::create([
                'member_profile_id' => $profile->id,
                'name'              => $names[($index + $c) % count($names)],
                'date_of_birth'     => $childDob,
                'gender'            => $gender,
            ]);
        }
    }

    private function createPhotoDirectory(): void
    {
        Storage::disk('public')->makeDirectory('member-photos');
    }

    private function downloadAvatar(string $name, int $index, string $role): ?string
    {
        // Generate a colored letter avatar using ui-avatars.com
        $colors = [
            'exec' => ['4f46e5', '0891b2', '059669', 'd97706', 'dc2626', '7c3aed', '0284c7'],
            'general' => ['6d28d9', '1d4ed8', '047857', 'b45309', 'b91c1c', '6b21a8', '0369a1'],
        ];
        $bg       = $colors[$role][$index % count($colors[$role])];
        $initials = $this->getInitials($name);
        $url      = "https://ui-avatars.com/api/?name=" . urlencode($initials) . "&size=200&background={$bg}&color=ffffff&bold=true&length=2";
        $filename = 'member-photos/' . \Illuminate\Support\Str::slug($name) . '-' . $index . '.png';

        try {
            $response = Http::timeout(10)->get($url);
            if ($response->successful()) {
                Storage::disk('public')->put($filename, $response->body());
                return $filename;
            }
        } catch (\Exception $e) {
            // Fall through — no photo if download fails
        }

        return null;
    }

    private function getInitials(string $name): string
    {
        $parts = explode(' ', $name);
        $initials = '';
        foreach (array_slice($parts, 0, 2) as $part) {
            $initials .= mb_substr($part, 0, 1);
        }
        return strtoupper($initials);
    }

    private function nameToEmail(string $name, string $prefix): string
    {
        $slug = strtolower(str_replace([' ', '.', "'"], ['', '', ''], $name));
        return substr($slug, 0, 15) . '@uva-' . $prefix . '.com';
    }

    private function randomMohalla(): string
    {
        $mohallaList = [
            'Kabir Nagar', 'Gandhi Nagar', 'Ram Nagar', 'Shastri Nagar', 'Nehru Nagar',
            'Civil Lines', 'Adarsh Nagar', 'Shyam Nagar', 'Indira Nagar', 'Patel Nagar',
            'Bagh Farzana', 'Sigra', 'Lanka', 'Sarnath Colony', 'Jaitpura',
        ];
        return $mohallaList[array_rand($mohallaList)];
    }
}
