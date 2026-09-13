export type ProjectStatus =
  | "Built"
  | "Deployed"
  | "Open Source"
  | "Pilot-stage"
  | "Prototype"
  | "Concept"
  | "Hackathon";

export type ProjectGroup = "selected" | "backend" | "product";

export interface FlowDiagram {
  label?: string;
  steps: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface CaseStudySection {
  heading: string;
  body: string[];
}

export interface BackendAnatomy {
  domain: string;
  backendControls: string;
  businessRules: string[];
  dataStorage: string;
  stateNote: string;
  risks: string[];
  safeguards: string;
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  status: ProjectStatus;
  groups: ProjectGroup[];
  tagline: string;
  problem: string;
  challenge: string;
  architecture: FlowDiagram;
  stateMachine?: FlowDiagram;
  anatomy?: BackendAnatomy;
  contribution?: string;
  tech: string[];
  result: string;
  links?: ProjectLink[];
  hasCaseStudy?: boolean;
  caseStudy?: {
    context: string[];
    problem: string[];
    system: string[];
    engineeringChallenges: string[];
    architecture: FlowDiagram;
    secondaryDiagram?: FlowDiagram;
    decisions: { title: string; body: string }[];
    result: string[];
    learnings: string[];
  };
}

export const projects: Project[] = [
  {
    slug: "ada-reservation-system",
    title: "ADA University Room Reservation System",
    eyebrow: "Workflow & Approval Platform",
    status: "Built",
    groups: ["selected", "backend"],
    tagline:
      "A reservation and approval platform built as a single Next.js app on Supabase Postgres — every sensitive write runs through a locked, transactional SQL function, not scattered application code, so double-booking is impossible at the database level.",
    problem:
      "Room requests at ADA University and USG were coordinated informally, with no system enforcing availability, approval order, or conflict rules consistently.",
    challenge:
      "Correctly enforcing reservation rules under real concurrency — preventing double-booking, respecting role-based approval authority, and keeping reservation state and notifications consistent — without a separate backend service to own that logic.",
    architecture: {
      steps: [
        "Server Action",
        "Postgres Function (Room-Locked)",
        "RLS-Protected Tables",
        "PostgreSQL (Supabase)",
        "Email Outbox",
        "Resend Delivery",
      ],
    },
    stateMachine: {
      label: "Reservation status (persisted)",
      steps: ["PENDING", "APPROVED", "CANCELLED"],
    },
    anatomy: {
      domain:
        "Rooms, availability windows, and reservation requests moving through a university approval hierarchy — a requester, and an admin with USG's approval authority.",
      backendControls:
        "Whether a reservation is even allowed to exist at a given time. Every sensitive write — submit, approve, reject, cancel, modify — runs as a database function, not a direct table write, so authorization and business rules live in one place regardless of which client calls them.",
      businessRules: [
        "A reservation can only be approved if it doesn't overlap an already-approved reservation for the room — enforced by a database exclusion constraint, not just application logic.",
        "Only an active admin can approve or reject a request; no client role has a direct write grant on the reservations table at all.",
        "An approval re-checks availability and conflicts at decision time, not just at submission time, so a slow-to-decide admin can't approve something that's no longer valid.",
      ],
      dataStorage:
        "PostgreSQL via Supabase. Every write funnels through locked SQL functions — each one takes the room's row lock first, in the same order every time, before checking or changing anything. A partial exclusion constraint on the reservations table makes overlapping approved bookings impossible to insert, independent of any application code.",
      stateNote:
        "The persisted state machine is small on purpose: PENDING → APPROVED or REJECTED, and APPROVED → CANCELLED. Availability and conflict checks are pre-conditions enforced inside the submit/approve functions, not separate stored states.",
      risks: [
        "Two admins approving overlapping requests for the same room at nearly the same moment — one has to lose outright, not silently create a double-booking.",
        "A retried submission after a dropped network response could create a duplicate reservation if the same request were processed twice.",
      ],
      safeguards:
        "Every scheduling function locks the room's row before doing anything, in a fixed order, so concurrent writes for the same room fully serialize — proven against two real concurrent connections, not just asserted. An idempotency-key table lets a retried submission reuse the same in-flight request instead of creating a duplicate, and the exclusion constraint is the final backstop even if that logic were ever wrong.",
    },
    tech: [
      "TypeScript",
      "Next.js",
      "PostgreSQL (Supabase)",
      "Row-Level Security",
      "SQL / PL-pgSQL",
      "Transactional Functions",
    ],
    result:
      "Every scheduling write funnels through a locked Postgres function and a database exclusion constraint — proven against two real concurrent connections, with 121 pgTAP assertions covering authorization, locking, and the constraint directly.",
    hasCaseStudy: true,
    links: [{ label: "GitHub", href: "https://github.com/HuseynBlv/C205" }],
    caseStudy: {
      context: [
        "ADA University's rooms and shared spaces were reserved informally — through messages, spreadsheets, and verbal agreements between students, staff, and USG (the university's student government, which reviews and approves space requests).",
        "That worked at low volume, but broke down as soon as two people wanted the same room, or a request needed sign-off from someone who wasn't in the conversation.",
      ],
      problem: [
        "The system needed a single source of truth for who has a room, when, and under what authority — and it needed to hold up under real concurrency, not just look correct in a demo.",
        "A reservation is only correct if availability, approval authority, and notification state all agree — a room can't be 'approved' if it was already booked in that window, and a user shouldn't be told their reservation is approved before the database has actually committed to it.",
      ],
      system: [
        "The whole app is one deployable Next.js unit with no separate backend service — every sensitive write (submit, approve, reject, cancel, modify) runs as a database function invoked from a Server Action, not a direct table write from application code.",
        "Every one of those functions locks the room's row first, in the same order every time, before checking availability or writing anything — that's what makes 'two admins approve the same slot at once' resolve to exactly one winner instead of a race.",
        "Row-Level Security is deny-by-default: default privileges are revoked schema-wide, so every table and function needs an explicit grant. No client role — not even an authenticated user — has a direct write grant on the reservations table; the only path in is through the locked functions.",
      ],
      engineeringChallenges: [
        "Making 'is this room actually free' a database-level guarantee — a partial exclusion constraint that makes overlapping approved bookings physically impossible to insert, not just checked for in application code.",
        "Serializing concurrent scheduling writes for one room without locking out unrelated rooms, and proving it against real concurrent connections rather than assuming a lock 'should' work.",
        "Keeping notification delivery reliable without a dedicated message queue: a durable outbox table plus independent trigger paths, so a single point of failure can't silently drop an email.",
      ],
      architecture: {
        steps: [
          "Server Action",
          "Postgres Function (Room-Locked)",
          "RLS-Protected Tables",
          "PostgreSQL (Supabase)",
          "Email Outbox",
          "Resend Delivery",
        ],
      },
      secondaryDiagram: {
        label: "Booking engine — locked function order",
        steps: [
          "submit_request (lock room, validate, create PENDING)",
          "approve_request (re-validate, lock, set APPROVED)",
          "cancel_reservation (APPROVED to CANCELLED)",
        ],
      },
      decisions: [
        {
          title: "One app, no separate backend — but still a real authorization boundary",
          body: "All data access runs as Next.js Server Actions calling Postgres directly, or through database functions for anything transactional. There's no separate API layer, but authorization is still centralized — in the database functions, not scattered across route handlers.",
        },
        {
          title: "Lock the room, not the whole table",
          body: "Every scheduling function takes the specific room's row lock first, in a fixed order (room, then the reservation once its id is known). With a small number of rooms this fully serializes writes for the room being booked while leaving every other room's writes unaffected.",
        },
        {
          title: "An exclusion constraint as the backstop, not the only guard",
          body: "Locking makes concurrent approvals correct in practice; the partial exclusion constraint on approved reservations is what makes an overlap impossible even if that locking logic were ever wrong — two independent layers, not one.",
        },
      ],
      result: [
        "The concurrency guarantee is real, not just designed: two genuine concurrent connections attempting overlapping approvals were tested against the locked functions, and exactly one succeeded.",
        "121 pgTAP assertions cover RLS/grant boundaries, function-level authorization, and the exclusion constraint directly, run against a real local Supabase/Postgres instance.",
        "Email delivery was verified end to end with a real Resend API key and a real reservation — an actual email was sent and delivered, not simulated.",
        "This is a built system reflecting the ADA/USG reservation workflow, exercised against real infrastructure — not a deployed, university-wide production service in active use.",
      ],
      learnings: [
        "A workflow's correctness guarantee doesn't have to live in a separate backend service — a Postgres function with the right locking and constraints can be exactly as authoritative as an application-layer service, sometimes more so, since the constraint holds even if the calling code is wrong.",
        "Concurrency correctness is worth testing directly, not just reasoning about — a real two-connection proof-of-lock test catches what code review alone wouldn't.",
        "The best guarantee lives closest to the data — a database exclusion constraint or RLS policy doesn't get bypassed by a bug two layers up in application code, the way an equivalent application-level check could.",
      ],
    },
  },
  {
    slug: "rideflow",
    title: "RideFlow",
    eyebrow: "State Machine & Domain Modeling",
    status: "Built",
    groups: ["selected", "backend"],
    tagline:
      "A backend-only ride-hailing service built around one problem: modeling a ride as a strict state machine so an invalid combination of states — like a completed ride with no driver — is structurally impossible.",
    problem:
      "A ride isn't a record you update — it's a sequence with real preconditions. A ride can't be IN_PROGRESS without a driver, and two drivers can't both win the same ride if they accept it within milliseconds of each other.",
    challenge:
      "Enforcing every ride-state transition in one place, under real concurrency, so an invalid jump — or a second driver accepting a ride someone else just took — is rejected before it reaches PostgreSQL, not caught after the fact.",
    architecture: {
      steps: [
        "Client",
        "REST Controller",
        "Ride Service",
        "Domain Rules (RideStateService)",
        "Repository (Pessimistic Lock)",
        "PostgreSQL",
      ],
    },
    stateMachine: {
      steps: ["REQUESTED", "MATCHING", "DRIVER_ASSIGNED", "DRIVER_ARRIVING", "IN_PROGRESS", "COMPLETED"],
    },
    anatomy: {
      domain:
        "A ride request moving between two people — a rider and a driver — through a strict sequence of states, from first request to a paid, completed trip.",
      backendControls:
        "Whether a given ride is even allowed to change status right now, and whether the caller making the request is actually the driver assigned to that ride.",
      businessRules: [
        "A ride can only move to DRIVER_ASSIGNED from MATCHING — never directly from REQUESTED.",
        "IN_PROGRESS can be reached from DRIVER_ASSIGNED or DRIVER_ARRIVING, but from nowhere else.",
        "Only the driver already assigned to a ride can start or complete it; a second driver accepting the same ride is rejected, not queued.",
      ],
      dataStorage:
        "PostgreSQL. Ride, rider, and driver are related tables; status is a single enumerated column guarded by a version field for optimistic locking, and every transition is also written to a separate ride_events table as an audit log.",
      stateNote:
        "REQUESTED → MATCHING → DRIVER_ASSIGNED → DRIVER_ARRIVING → IN_PROGRESS → COMPLETED — each name is the domain's own vocabulary for what's happening, not a generic status flag.",
      risks: [
        "Two drivers accepting the same ride within milliseconds of each other — the second acceptance has to lose outright, not silently overwrite the first.",
        "A retried request (a driver's app resending an accept call after a dropped connection) could be misread as a duplicate, invalid action instead of the same action arriving twice.",
      ],
      safeguards:
        "Ride acceptance takes a pessimistic database lock on the ride row before checking or changing anything, so two simultaneous accepts can't both succeed. Every transition runs inside a single @Transactional method, and a repeated accept from the same driver is treated as idempotent instead of an error.",
    },
    tech: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "PostgreSQL",
      "JWT",
      "Validation",
      "Exception Handling",
      "JUnit",
    ],
    result:
      "Every ride mutation funnels through one guarded method that whitelists legal source states per transition — an invalid jump throws immediately, before it reaches persistence, and a unit test asserts exactly that.",
    hasCaseStudy: true,
    caseStudy: {
      context: [
        "RideFlow isn't a rider app or a maps UI — it's the backend underneath one: the service that decides whether a given change to a ride is actually allowed to happen.",
        "The domain is deliberately small — riders, drivers, rides — so the state machine and the concurrency around it could be the real subject, not scaffolding around a bigger feature set.",
      ],
      problem: [
        "A ride moves through a fixed sequence — requested, matched, assigned, in progress, completed — and each step has real preconditions. A ride can't be IN_PROGRESS if no driver was ever assigned, and it can't be COMPLETED twice.",
        "The harder version of that problem is concurrency: two drivers can try to accept the same ride within milliseconds of each other, and exactly one of them has to win.",
      ],
      system: [
        "Every ride mutation goes through the same four layers: a REST controller that checks the caller's role, a RideService that owns the use case, a RideStateService that owns exactly one thing — whether a transition is legal — and a repository that persists the result.",
        "RideStateService exposes one method per business action (assign a driver, start a ride, complete a ride...), and every one of them calls a single private guard: check the ride's current status against an explicit whitelist of allowed source states, or throw.",
        "Acceptance is the one place two clients can race for the same row, so acceptRide loads the ride with a database-level write lock before touching it. The Ride entity also carries a version column as a second line of defense against lost updates.",
      ],
      engineeringChallenges: [
        "Making 'this transition is illegal' a single, centrally-enforced rule instead of a scattered set of if-checks repeated in every method that touches ride status.",
        "Serializing ride acceptance so two drivers racing for the same ride can't both succeed, without locking the entire rides table for unrelated rides.",
        "Treating a retried request from the same driver as a no-op instead of a conflict — a flaky client resending an accept call is normal, not an attack.",
      ],
      architecture: {
        steps: [
          "Client",
          "REST Controller",
          "Ride Service",
          "Domain Rules (RideStateService)",
          "Repository (Pessimistic Lock)",
          "PostgreSQL",
        ],
      },
      decisions: [
        {
          title: "One guarded method, not one if-check per endpoint",
          body: "Every legal transition is expressed as a call into a single private guard inside RideStateService: check the current status against an explicit set of allowed sources, or throw. A controller or service method never decides for itself whether a status change is valid — it calls the specific transition and lets the guard throw. That's the actual mechanism that makes COMPLETED → IN_PROGRESS impossible: COMPLETED is never in the allowed-source set for any transition.",
        },
        {
          title: "Lock the row before you decide, not after",
          body: "acceptRide takes a pessimistic write lock on the ride (and the driver) before checking status or availability. Deciding first and locking to save the result later would leave a window where two transactions could both read MATCHING and both think they won.",
        },
        {
          title: "An IllegalStateException is still just a 409",
          body: "Invalid transitions raise a plain IllegalStateException from the domain layer. A global exception handler maps it — along with a dedicated ConflictException for things like “this ride isn't yours” — to HTTP 409, so the caller gets a normal API error, not a stack trace.",
        },
      ],
      result: [
        "The state machine holds: every transition in the codebase funnels through RideStateService, and a unit test asserts that an out-of-order transition — completing a ride that was never assigned or started — throws immediately instead of silently succeeding.",
        "One honest gap: DRIVER_ARRIVING is fully modeled and guarded in RideStateService, but no controller endpoint currently triggers it. The domain layer supports a transition the API surface doesn't expose yet — a smaller problem than not having modeled it at all.",
        "This is a built backend, not a deployed or commercially operated ride-hailing service.",
      ],
      learnings: [
        "Centralizing every state transition behind one guarded method did more for correctness than any individual validation check — it made 'is this allowed' a question with exactly one answer, checked in exactly one place.",
        "Modeling the domain — rider, driver, ride, and the specific verbs that move a ride between states — before writing endpoints made the service layer's boundaries obvious: RideService owns use cases, RideStateService owns legality, the repository owns persistence.",
        "Concurrency isn't a separate concern from domain modeling. The fact that two drivers can race for one ride is itself a business rule, and it belongs next to the other business rules, not bolted on as a database detail.",
      ],
    },
  },
  {
    slug: "testcontainers-java",
    title: "Testcontainers Java — Open Source Contribution",
    eyebrow: "Contribution to an Established Java Project",
    status: "Open Source",
    groups: ["selected", "backend"],
    tagline:
      "A contribution to Testcontainers Java's MongoDB module — added test coverage for initialization-script behavior inside an existing, production-grade codebase.",
    problem:
      "Testcontainers Java is a widely used library with its own conventions, review standards, and existing architecture — contributing means working inside constraints a greenfield project doesn't have.",
    challenge:
      "Understanding an unfamiliar, production-grade codebase well enough to add correct test coverage, without assuming greenfield freedom over structure or style.",
    architecture: {
      steps: [
        "Existing MongoDB Module",
        "Init-Script Behavior (Under Test)",
        "shouldRunInitScript() Test",
        "Gradle Verification",
      ],
    },
    contribution:
      "Worked within the MongoDB module of Testcontainers Java and added test coverage around initialization-script behavior, including a shouldRunInitScript() test — following the project's existing conventions and validating behavior through its Gradle test suite before opening a pull request against the upstream repository.",
    anatomy: {
      domain:
        "Not a business domain — the subject here is the runtime behavior of an existing library component: whether a MongoDB container correctly executes a configured initialization script on startup.",
      backendControls:
        "Nothing at runtime — the contribution doesn't control production behavior, it controls what's verified. It determines whether one specific piece of container-startup behavior is provably correct going forward.",
      businessRules: [
        "Not applicable in the product sense. The invariant being enforced is a library guarantee: if an init script is configured, Testcontainers must run it before the container is considered ready.",
      ],
      dataStorage:
        "None of its own. The test spins up a real, disposable MongoDB container as its subject, exercises it, and tears it down — nothing outlives the test run.",
      stateNote:
        "Module exists → behavior identified as untested → test written against a real container → verified by Gradle → submitted as a pull request.",
      risks: [
        "A test written against a mocked MongoDB would pass even if the real init-script behavior were broken — exactly the gap this contribution closes.",
        "A timing-dependent or flaky test could produce false failures unrelated to the actual behavior being verified.",
      ],
      safeguards:
        "The test runs against a real MongoDB container rather than a mock, so it validates actual behavior instead of an assumption about it, and it follows the MongoDB module's existing conventions so it integrates into the project's Gradle suite without special-casing.",
    },
    tech: ["Java", "Gradle", "JUnit", "MongoDB", "Docker", "Testcontainers"],
    result:
      "An open pull request against testcontainers-java, awaiting maintainer review — plus a working understanding of how to read, test, and extend a large, actively maintained open-source Java codebase under its own conventions.",
    links: [{ label: "Testcontainers Java", href: "https://github.com/testcontainers/testcontainers-java" }],
    hasCaseStudy: true,
    caseStudy: {
      context: [
        "Testcontainers Java is a widely used library for running real dependencies — databases, message brokers, and other services — in disposable Docker containers during tests. It's a production-grade codebase maintained by an active open-source community, not a project built from scratch by one person.",
        "Contributing here is a different kind of engineering work than building a personal project: the architecture, conventions, and review bar already exist, and the job is to work within them correctly.",
      ],
      problem: [
        "The MongoDB module supports running an initialization script against a MongoDB container on startup, but that specific behavior — that the init script actually runs — didn't have direct test coverage.",
        "The task was narrow in scope but required broad context: understanding how the MongoDB module fits into the rest of the library, how its existing tests are structured, and how Testcontainers' Docker-backed test lifecycle works end to end.",
      ],
      system: [
        "Testcontainers Java tests typically spin up a real containerized instance of the target service, exercise it, and tear it down — so 'testing' here means validating behavior against an actual MongoDB container, not a mock.",
        "The contribution follows that same model: a shouldRunInitScript() test that starts a MongoDB container configured with an init script, and asserts the script actually ran.",
      ],
      engineeringChallenges: [
        "Reading an existing production-grade module well enough to know where a new test belongs and what conventions it needs to follow.",
        "Writing a test against real Docker/MongoDB container behavior rather than a mocked dependency, consistent with the project's own testing philosophy.",
        "Running and validating the change through the project's Gradle test suite, and preparing it as a pull request suitable for review by maintainers who didn't write the surrounding code either.",
      ],
      architecture: {
        steps: [
          "Existing MongoDB Module",
          "Init-Script Behavior (Under Test)",
          "shouldRunInitScript() Test",
          "Gradle Verification",
        ],
      },
      decisions: [
        {
          title: "Match existing conventions over personal style",
          body: "The test was written to fit the MongoDB module's existing structure and naming, rather than introducing a different pattern — contributing to a shared codebase means optimizing for consistency, not individual preference.",
        },
        {
          title: "Test against a real container, not a mock",
          body: "Consistent with how Testcontainers itself is designed, the test validates real init-script execution against a running MongoDB container rather than simulating the behavior.",
        },
      ],
      result: [
        "The outcome is a small, focused contribution — a test covering initialization-script behavior in the MongoDB module — submitted as pull request #11923 against testcontainers-java, currently open and awaiting maintainer review.",
        "Its value isn't the size of the change. It's what the change required: reading someone else's architecture correctly, and adding to it without breaking its conventions.",
      ],
      learnings: [
        "Working inside an established codebase is a fundamentally different skill from building a project from zero — the constraint isn't 'what's the best design,' it's 'what's correct given the design that already exists.'",
        "Test coverage in a widely used library carries a different weight: it protects behavior that many other projects silently depend on.",
      ],
    },
  },
  {
    slug: "scan",
    title: "SCAN — Sales & Consumption Analytics Network",
    eyebrow: "Retail Analytics Platform",
    status: "Pilot-stage",
    groups: ["selected", "product"],
    tagline:
      "A retail analytics platform that pivoted from a cashier-side scanning idea to a POS-export pipeline — now operating as a startup, with real retailers using the platform.",
    problem:
      "Independent and medium-sized retailers already generate receipt-level transaction data through their POS systems, but that data rarely becomes usable product- or basket-level analytics.",
    challenge:
      "The real challenge wasn't technical scanning — it was discovering, through retailer interviews, that the original mobile-scanning assumption was solving a problem existing POS systems had already solved, then building a real ingestion pipeline around their exports instead of a new capture flow.",
    architecture: {
      steps: [
        "POS Export",
        "Retailer Connector",
        "Mapping & Validation",
        "Receipt Reconstruction",
        "Deterministic Analytics",
        "Retailer / CCI Portals",
      ],
    },
    tech: ["Java", "Spring Boot", "PostgreSQL", "REST APIs", "React", "Docker"],
    result:
      "SCAN was selected among 200+ ideas at the Coca-Cola İçecek OneIdea innovation competition, and the pivot to POS integration paid off: it now operates as a startup, with real retailers using a Java/Spring Boot backend, a retailer connector, and two analytics portals — the same pipeline validated end to end against a 10,000-basket dataset before any retailer went live.",
    hasCaseStudy: true,
    links: [
      { label: "Live Demo", href: "https://scan-demo.onrender.com" },
      { label: "GitHub", href: "https://github.com/HuseynBlv/SCAN" },
    ],
    caseStudy: {
      context: [
        "SCAN originated from the Coca-Cola İçecek OneIdea innovation competition, where it was selected among more than 200 submitted ideas.",
        "The starting premise: independent and medium-sized retailers already generate receipt-level transaction data through their POS systems — the challenge is turning that into usable analytics, not capturing new data.",
      ],
      problem: [
        "The first approach assumed retailers needed a new way to capture transaction data: cashier-side mobile barcode scanning, run alongside the existing checkout process.",
        "That assumption didn't survive contact with actual retailers — they already had POS systems generating exactly the data SCAN was trying to capture through scanning.",
      ],
      system: [
        "SCAN pivoted from capture to integration: a retailer connector watches for scheduled POS exports and uploads them over authenticated HTTPS; the backend maps columns, reconstructs receipts from transaction lines, deduplicates identical re-uploads, and turns the result into deterministic analytics served through two permission-scoped portals — one for the retailer, one for CCI's approved basket-level view.",
        "The backend (scan-api) is Java/Spring Boot with JPA and Flyway-managed PostgreSQL migrations. A separate Java service (scan-connector) handles retailer-side file monitoring and upload. The dashboard (scan-app) is React/Vite, talking to scan-api over REST.",
        "Imports are idempotent by design: re-uploading identical bytes returns the existing import job instead of double-counting, and a receipt reused with different contents is rejected outright rather than silently rewriting history.",
      ],
      engineeringChallenges: [
        "Designing around real retailer infrastructure instead of the infrastructure the initial concept assumed would need to be built.",
        "Making receipt reconstruction and product mapping deterministic and idempotent across retailers whose POS exports don't share a format — no fuzzy matching, no model in the analytics path.",
        "Proving the pipeline end to end before any real retailer is involved: importing and validating a 10,000-basket, 54,848-line synthetic export against a live deployment.",
      ],
      architecture: {
        steps: [
          "POS Export",
          "Retailer Connector",
          "Mapping & Validation",
          "Receipt Reconstruction",
          "Deterministic Analytics",
          "Retailer / CCI Portals",
        ],
      },
      secondaryDiagram: {
        label: "Concept evolution",
        steps: [
          "Initial Assumption",
          "Mobile Scanning Prototype (Legacy)",
          "Retailer Interviews",
          "POS Integration Pivot",
          "Connector & Ingestion Pipeline (Built)",
          "Deployed Demo (Render + Neon)",
          "Operating as a Startup (Real Users)",
        ],
      },
      decisions: [
        {
          title: "Let field research override the original technical plan",
          body: "The mobile-scanning prototype was a reasonable first hypothesis, but retailer interviews made it clear the harder, more valuable problem was integration, not capture. It's kept in the repository as an explicitly labeled legacy mode — not presented as the current product.",
        },
        {
          title: "Validate against a large synthetic dataset before touching a real retailer",
          body: "Before any live retailer is involved, the full pipeline is proven against a 10,000-basket dataset with a documented, reproducible result — so the first real integration tests retailer-specific formatting quirks, not the pipeline's core correctness.",
        },
        {
          title: "Validate one POS format thoroughly before generalizing",
          body: "Support for a POS export format started as engineering work against an observed sample, proven against that real structure before assuming every POS vendor's export looks the same — the same discipline that shaped the original scanning-to-integration pivot.",
        },
      ],
      result: [
        "The POS-integration pipeline is real and now supports actual usage: SCAN operates as a startup, with real retailers using the platform rather than only a synthetic demo dataset.",
        "The underlying engineering was proven before any retailer went live — a Java/Spring Boot backend, a retailer connector, deterministic analytics, and two permission-scoped portals, validated end to end against a 10,000-basket dataset with 100% product-mapping coverage.",
        "The original mobile-scanning prototype still exists in the repository, explicitly labeled legacy — kept for reference, not presented as the current product.",
      ],
      learnings: [
        "The most valuable engineering decision in SCAN wasn't a line of code — it was being willing to discard a working prototype once research showed the underlying assumption was wrong.",
        "Proving a pipeline against a large synthetic dataset before involving a real retailer separates 'does the pipeline work' from 'does this retailer's export match what we assumed' — two different risks that are easy to conflate.",
        "Being precise about status labels matters as much as the engineering itself — the honest description changes as a project moves from a synthetic demo to real retailer usage, and it's worth updating rather than freezing at an earlier stage.",
      ],
    },
  },
  {
    slug: "personal-finance-api",
    title: "Personal Finance API",
    eyebrow: "Backend & Authentication",
    status: "Built",
    groups: ["backend"],
    tagline:
      "A backend-first personal finance service built around REST APIs, JWT authentication, and database-backed business logic — not a CRUD demo.",
    problem:
      "Personal finance data — transactions, categories, balances — needs correctness guarantees a simple CRUD API doesn't provide: authenticated access, validated input, and a clear separation between HTTP handling and business rules.",
    challenge:
      "Structuring the service so persistence, business logic, and API contracts stay separated, while JWT-based authentication and authorization gate every protected resource consistently.",
    architecture: {
      steps: ["Authenticated Request", "Service Logic", "Transaction Validation", "Persistence (PostgreSQL)"],
    },
    stateMachine: {
      label: "Authentication flow",
      steps: [
        "Credentials",
        "Authentication",
        "JWT",
        "Authorized Request",
        "Security Filter",
        "Protected Resource",
      ],
    },
    anatomy: {
      domain:
        "A single user's financial activity — transactions and the categories they belong to — scoped strictly to whoever is authenticated.",
      backendControls:
        "Whether the caller is who they claim to be, whether they own the data they're asking for, and whether a transaction is well-formed before it's allowed to reach PostgreSQL.",
      businessRules: [
        "A user can only read or write their own transactions and categories, never another user's.",
        "A transaction must reference a valid category and an authenticated owner before it's persisted.",
        "Requests without a valid JWT are rejected before they reach any business logic.",
      ],
      dataStorage:
        "PostgreSQL via Spring Data JPA. Users, categories, and transactions are modeled as related entities, with ownership enforced at the query level — not just filtered out of the response afterward.",
      stateNote:
        "The meaningful state here isn't the transaction — it's the request's authorization state: unauthenticated → credentials verified → JWT issued → authorized on every subsequent request.",
      risks: [
        "A request without a valid JWT could reach a controller meant only for authenticated users, if authorization were checked per-endpoint instead of centrally.",
        "A transaction could be persisted referencing a category or user that doesn't exist, corrupting downstream reads.",
      ],
      safeguards:
        "JWT validation happens in a security filter before a request reaches any controller, so authorization isn't something each endpoint has to remember to implement correctly. Controllers, services, and repositories stay separated so validation and business rules run before Spring Data JPA ever writes to PostgreSQL.",
    },
    tech: ["Java", "Spring Boot", "PostgreSQL", "Spring Data JPA", "JWT", "REST"],
    result:
      "A layered backend where controllers, services, and repositories each have one job — with authentication, validation, and exception handling enforced consistently across every endpoint.",
  },
  {
    slug: "pulsenote",
    title: "PulseNote",
    eyebrow: "Landing Page & Idea Validation",
    status: "Concept",
    groups: ["product"],
    tagline:
      "A landing page and private-beta waitlist testing demand for an async, voice-first stand-up tool. The voice-to-digest pipeline itself is a proposed workflow — not yet built.",
    problem:
      "Synchronous stand-ups interrupt focus, and the usual async substitute — a daily text questionnaire — captures too little signal to be useful on its own.",
    challenge:
      "Validating whether the idea is worth building before building it: a landing page and waitlist to test real demand, rather than starting with the harder transcription/summarization pipeline.",
    architecture: {
      steps: [
        "Voice Update (proposed)",
        "Transcription (proposed)",
        "AI Summarization (proposed)",
        "Structured Digest (proposed)",
        "Slack Delivery (proposed)",
      ],
    },
    tech: ["Next.js", "TypeScript", "Supabase (Waitlist)"],
    result:
      "A live landing page collecting private-beta signups to gauge demand. No transcription, summarization, or digest delivery is implemented yet — the product itself remains a proposed workflow.",
    links: [{ label: "GitHub", href: "https://github.com/HuseynBlv/PulseNote" }],
  },
  {
    slug: "orchardguard-ai",
    title: "OrchardGuard AI",
    eyebrow: "Agritech Concept",
    status: "Concept",
    groups: ["product"],
    tagline:
      "An early-stage agritech concept from an agriculture-focused innovation bootcamp in Qusar, Azerbaijan, exploring AI and weather data for orchard frost/hail risk.",
    problem:
      "Orchard farmers have limited tools to anticipate frost and hail risk at the parcel level, or to document crop damage in a way insurers can use.",
    challenge:
      "Reasoning through a technically and operationally feasible design across weather data, computer vision, and insurance workflows — under bootcamp time constraints, without building toward a production system.",
    architecture: {
      steps: ["Weather + Parcel Data", "Risk Scoring (proposed)", "Farmer Alerts (proposed)", "Photo Documentation (proposed)", "Insurance Dashboard (proposed)"],
    },
    tech: ["Weather Data", "Geospatial Data", "Computer Vision (explored)", "Risk Scoring (proposed)"],
    result:
      "A concept-stage design covering three proposed components — parcel-level risk alerts, photo-assisted damage documentation, and an insurer-facing risk dashboard. No model was trained, no farmers used the system, and no MVP was built — the value was in problem research, solution design, and feasibility analysis.",
  },
  {
    slug: "nasa-space-apps",
    title: "NASA Space Apps Challenge 2024",
    eyebrow: "Hackathon — Seismic Signal Analysis",
    status: "Hackathon",
    groups: ["product"],
    tagline:
      "A hackathon project analyzing seismic data and signals under time constraints, as part of NASA Space Apps Challenge 2024.",
    problem:
      "The challenge required extracting meaningful signal from noisy seismic data within a fixed, short timeframe.",
    challenge:
      "Rapid data analysis and prototyping — getting from raw seismic data to a working, explainable approach within a hackathon's time limits.",
    architecture: {
      steps: ["Raw Seismic Data", "Signal Processing", "Analysis", "Prototype Output"],
    },
    tech: ["Data Analysis", "Signal Processing", "Rapid Prototyping"],
    result:
      "A hackathon submission demonstrating rapid technical experimentation on a scientific dataset under time pressure.",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getCaseStudyProjects() {
  return projects.filter((p) => p.hasCaseStudy);
}

export function getByGroup(group: ProjectGroup) {
  return projects.filter((p) => p.groups.includes(group));
}
