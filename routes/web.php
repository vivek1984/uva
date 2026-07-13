<?php

use App\Http\Controllers\Accounting;
use App\Http\Controllers\Admin;
use App\Http\Controllers\BusinessPageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Executive;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\Member;
use App\Http\Controllers\MemberProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionnaireController;
use App\Http\Controllers\QuestionnaireResponseController;
use App\Http\Controllers\RequirementActionController;
use App\Http\Controllers\RequirementController;
use App\Models\MemberProfile;
use App\Models\PageSection;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $sections = PageSection::with('images')
        ->where('is_published', true)
        ->orderBy('order')
        ->get()
        ->map(fn($s) => $s->toPublic());

    // Executive members — post-holders first, then plain executives
    $executives = User::where('role', 'executive')
        ->where('status', 'active')
        ->with(['profile', 'heldPost.post'])
        ->get()
        ->sortByDesc(fn ($u) => $u->heldPost !== null)
        ->values()
        ->map(fn ($u) => [
            'id'        => $u->id,
            'name'      => $u->name,
            'photo_url' => $u->profile?->photo ? asset('storage/' . $u->profile->photo) : null,
            'post_name' => $u->heldPost?->post?->name ?? null,
            'slug'      => $u->business_slug,
        ]);

    // All active members — shuffled daily so every member gets a turn at the top
    $daySeed = (int) now()->format('Ymd');

    $members = User::whereIn('role', ['general', 'executive'])
        ->where('status', 'active')
        ->with(['profile', 'products' => fn ($q) => $q->where('is_published', true)])
        ->get()
        ->map(fn($u) => [
            'id'               => $u->id,
            'name'             => $u->name,
            'firm_name'        => $u->profile?->firm_name,
            'firm_address'     => $u->profile?->firm_address,
            'business_services'=> $u->profile?->business_services,
            'photo_url'        => $u->profile?->photo ? asset('storage/' . $u->profile->photo) : null,
            'business_url'     => route('business.show', $u->business_slug),
            'products'         => $u->products->map(fn ($p) => [
                'id'       => $p->id,
                'name'     => $p->name,
                'category' => $p->category,
            ])->values(),
        ])
        ->shuffle($daySeed)
        ->values();

    return Inertia::render('Welcome', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
        'sections'    => $sections,
        'executives'  => $executives,
        'members'     => $members,
    ]);
});

// Public requirement submission (from the homepage search bar area)
Route::post('/requirements', [RequirementController::class, 'store'])->name('requirements.store');

// Redirect to role-specific dashboard after login
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Laravel Breeze profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Shared member profile form (all roles)
    Route::post('/member-profile', [MemberProfileController::class, 'store'])->name('member-profile.store');

    // Shared requirement board actions (all roles)
    Route::post('/requirements/{requirement}/seen', [RequirementActionController::class, 'markSeen'])->name('requirements.seen');
    Route::post('/requirements/{requirement}/attend', [RequirementActionController::class, 'attend'])->name('requirements.attend');
    Route::post('/requirements/{requirement}/unattend', [RequirementActionController::class, 'unattend'])->name('requirements.unattend');
    Route::post('/requirements/{requirement}/complete', [RequirementActionController::class, 'complete'])->name('requirements.complete');
});

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/posts', [Admin\PostController::class, 'store'])->name('posts.store');
    Route::delete('/posts/{post}', [Admin\PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/members/{member}/role', [Admin\MemberController::class, 'setRole'])->name('members.role');
    Route::post('/members/{member}/assign-post', [Admin\MemberController::class, 'assignPost'])->name('members.assign-post');
    Route::delete('/members/{member}/post', [Admin\MemberController::class, 'removePost'])->name('members.remove-post');
    Route::post('/members/{member}/toggle-status', [Admin\MemberController::class, 'toggleStatus'])->name('members.toggle-status');
    Route::delete('/members/{member}', [Admin\MemberController::class, 'destroy'])->name('members.destroy');
    Route::get('/members/export-csv', [Admin\MemberController::class, 'exportCsv'])->name('members.export-csv');
    Route::post('/members/import-csv', [Admin\MemberController::class, 'importCsv'])->name('members.import-csv');

    Route::post('/requirements/{requirement}/attend-as', [RequirementActionController::class, 'attendAs'])->name('requirements.attend-as');
    Route::delete('/requirements/{requirement}', [RequirementActionController::class, 'destroy'])->name('requirements.destroy');
    Route::get('/requirements/{requirement}/viewers', [RequirementActionController::class, 'viewers'])->name('requirements.viewers');
});

// Executive member routes
Route::middleware(['auth', 'verified', 'executive'])->prefix('executive')->name('executive.')->group(function () {
    Route::get('/dashboard', [Executive\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/members/toggle', [Executive\DashboardController::class, 'toggleMember'])->name('members.toggle');
    Route::post('/members/{member}/toggle-status', [Executive\DashboardController::class, 'toggleStatus'])->name('members.toggle-status');
    Route::post('/suggestions/mark-read', [Executive\DashboardController::class, 'markSuggestionsRead'])->name('suggestions.mark-read');
});

// General member routes
Route::middleware(['auth', 'verified'])->prefix('member')->name('member.')->group(function () {
    Route::get('/dashboard', [Member\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/suggestions', [Member\SuggestionController::class, 'store'])->name('suggestions.store');
});

// Questionnaire management (exec + admin only)
Route::middleware(['auth', 'verified', 'exec-or-admin'])->prefix('questionnaires')->name('questionnaires.')->group(function () {
    Route::get('/', [QuestionnaireController::class, 'index'])->name('index');
    Route::get('/create', [QuestionnaireController::class, 'create'])->name('create');
    Route::post('/', [QuestionnaireController::class, 'store'])->name('store');
    Route::get('/{questionnaire:slug}', [QuestionnaireController::class, 'show'])->name('show');
    Route::get('/{questionnaire:slug}/export-csv', [QuestionnaireController::class, 'exportCsv'])->name('export-csv');
    Route::patch('/{questionnaire}/toggle', [QuestionnaireController::class, 'toggle'])->name('toggle');
    Route::patch('/{questionnaire}/responses/{response}/amount', [QuestionnaireController::class, 'updateAmount'])->name('responses.amount');
    Route::delete('/{questionnaire}', [QuestionnaireController::class, 'destroy'])->name('destroy');
});

// Homepage section manager (exec + admin)
Route::middleware(['auth', 'verified', 'exec-or-admin'])->prefix('homepage')->name('homepage.')->group(function () {
    Route::get('/', [HomepageController::class, 'index'])->name('index');
    Route::get('/sections/create', [HomepageController::class, 'create'])->name('sections.create');
    Route::post('/sections', [HomepageController::class, 'store'])->name('sections.store');
    Route::get('/sections/{section}/edit', [HomepageController::class, 'edit'])->name('sections.edit');
    Route::post('/sections/{section}', [HomepageController::class, 'update'])->name('sections.update');
    Route::patch('/sections/{section}/toggle', [HomepageController::class, 'toggle'])->name('sections.toggle');
    Route::patch('/sections/{section}/move', [HomepageController::class, 'move'])->name('sections.move');
    Route::delete('/sections/{section}', [HomepageController::class, 'destroy'])->name('sections.destroy');
    Route::post('/sections/{section}/images', [HomepageController::class, 'storeImages'])->name('sections.images.store');
    Route::patch('/sections/{section}/images/{image}', [HomepageController::class, 'updateImage'])->name('sections.images.update');
    Route::delete('/sections/{section}/images/{image}', [HomepageController::class, 'destroyImage'])->name('sections.images.destroy');
});

// Accounting ledger routes
Route::middleware(['auth', 'verified', 'accounting'])->prefix('accounting/ledger')->name('accounting.ledger.')->group(function () {
    Route::get('/',                        [Accounting\LedgerController::class, 'index'])->name('index');
    Route::get('/cash',                    [Accounting\LedgerController::class, 'cashBook'])->name('cash');
    Route::get('/bank',                    [Accounting\LedgerController::class, 'bankBook'])->name('bank');
    Route::get('/expenses',               [Accounting\LedgerController::class, 'expenseLedger'])->name('expenses');
    Route::get('/member/{member}',         [Accounting\LedgerController::class, 'member'])->name('member');
});
Route::middleware(['auth', 'verified', 'accounting'])->prefix('accounting/ledger')->name('accounting.ledger.')->group(function () {
    Route::post('/opening-balance',                  [Accounting\LedgerController::class, 'saveOpeningBalance'])->name('opening-balance');
    Route::post('/member/{member}/opening-balance',  [Accounting\LedgerController::class, 'saveMemberOpeningBalance'])->name('member.opening-balance');
    Route::get('/export',                            [Accounting\LedgerExportController::class, 'export'])->name('export');
    Route::post('/import',                           [Accounting\LedgerExportController::class, 'import'])->name('import');
});

// Accounting — admin always allowed; others need accounting permission
Route::middleware(['auth', 'verified', 'accounting'])->prefix('accounting')->name('accounting.')->group(function () {
    Route::get('/', [Accounting\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/fees', [Accounting\FeeController::class, 'index'])->name('fees.index');
    Route::post('/fees', [Accounting\FeeController::class, 'store'])->name('fees.store');
    Route::delete('/fees/{fee}', [Accounting\FeeController::class, 'destroy'])->name('fees.destroy');
    Route::get('/expenses', [Accounting\ExpenseController::class, 'index'])->name('expenses.index');
    Route::post('/expenses', [Accounting\ExpenseController::class, 'store'])->name('expenses.store');
    Route::patch('/expenses/{expense}', [Accounting\ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('/expenses/{expense}', [Accounting\ExpenseController::class, 'destroy'])->name('expenses.destroy');
});

// Accounting admin-only routes (settings + access management)
Route::middleware(['auth', 'verified', 'admin'])->prefix('accounting')->name('accounting.')->group(function () {
    Route::get('/settings', [Accounting\DashboardController::class, 'settings'])->name('settings');
    Route::post('/settings', [Accounting\DashboardController::class, 'saveSettings'])->name('settings.save');
    Route::get('/access', [Accounting\AccessController::class, 'index'])->name('access.index');
    Route::post('/access', [Accounting\AccessController::class, 'store'])->name('access.store');
    Route::delete('/access/{user}', [Accounting\AccessController::class, 'destroy'])->name('access.destroy');
});

// Product management (all authenticated members: general + executive)
Route::middleware(['auth', 'verified'])->prefix('my')->name('my.')->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});

// Sitemap for search engines — lists the homepage and every active member's business page
Route::get('/sitemap.xml', function () {
    $urls = collect([
        ['loc' => url('/'), 'lastmod' => now()->toAtomString(), 'changefreq' => 'daily', 'priority' => '1.0'],
    ]);

    User::whereIn('role', ['general', 'executive'])
        ->where('status', 'active')
        ->whereNotNull('business_slug')
        ->get(['business_slug', 'updated_at'])
        ->each(function ($member) use ($urls) {
            $urls->push([
                'loc'        => route('business.show', $member->business_slug),
                'lastmod'    => $member->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority'   => '0.7',
            ]);
        });

    return response()
        ->view('sitemap', ['urls' => $urls])
        ->header('Content-Type', 'text/xml');
})->name('sitemap');

// Public questionnaire fill (no auth required)
Route::get('/q/{slug}', [QuestionnaireResponseController::class, 'show'])->name('questionnaire.fill');
Route::get('/q/{slug}/prefill', [QuestionnaireResponseController::class, 'prefill'])->name('questionnaire.prefill');
Route::post('/q/{slug}', [QuestionnaireResponseController::class, 'store'])->name('questionnaire.respond');

require __DIR__ . '/auth.php';

// Public business showcase — registered LAST so it never shadows any named route
Route::get('/{user:business_slug}', [BusinessPageController::class, 'show'])->name('business.show');
