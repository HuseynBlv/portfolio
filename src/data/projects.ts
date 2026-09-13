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
      "A reservation and approval platform that turns ad-hoc room requests into a governed workflow — availability, conflicts, approvals, and notifications enforced as backend logic.",
    problem:
      "Room requests at ADA University and USG were coordinated informally, with no system enforcing availability, approval order, or conflict rules consistently.",
    challenge:
      "Correctly enforcing reservation rules under concurrent requests — preventing double-booking, respecting role-based approval authority, and keeping reservation state, calendar data, and notifications consistent with each other.",
    architecture: {
      steps: [
        "Reservation Request",
        "Availability Check",
        "Conflict Detection",
        "Approval",
        "Persistence (PostgreSQL)",
        "Notification",
      ],
    },
    stateMachine: {
      steps: [
        "User Request",
        "Authorization",
        "Availability Check",
        "Conflict Detection",
        "Pending Reservation",
        "USG Review",
        "Approved / Rejected",
        "Notification",
      ],
    },
    anatomy: {
      domain:
        "Rooms, bookable time slots, and reservation requests moving through a university approval hierarchy — a requester, and a USG reviewer with the authority to approve or reject.",
      backendControls:
        "Whether a reservation is even allowed to exist at a given time. The API enforces availability, checks for conflicts, and restricts who can move a request from pending to approved or rejected.",
      businessRules: [
        "A reservation cannot be approved if it overlaps an already-approved reservation for the same room.",
        "Only a USG reviewer can transition a reservation to approved or rejected — the requester cannot.",
        "A rejected or cancelled reservation must not continue to hold its time slot.",
      ],
      dataStorage:
        "PostgreSQL. Rooms, time slots, and reservations are modeled as related tables, with reservation status and the requester/reviewer stored as foreign keys — overlap checks run as time-range queries against this schema, not as in-memory filtering.",
      stateNote:
        "A reservation is a state machine, not a row that gets overwritten — it can only reach 'approved' by passing through authorization, availability, and conflict checks in order.",
      risks: [
        "Two overlapping requests submitted at nearly the same time could both pass an availability check before either is committed, double-booking the room.",
        "An email could fire for a status the database hasn't actually persisted yet, telling a user their reservation is approved when it isn't.",
      ],
      safeguards:
        "Overlap detection is expressed as a database query, not application-level filtering, so correctness doesn't depend on what the application happens to have loaded in memory. Approval authority is enforced by role at the API layer, and notifications are only triggered after a status change is committed — never alongside it.",
    },
    tech: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "REST APIs",
      "Role-Based Access Control",
      "Email Notifications",
    ],
    result:
      "A working reservation platform where every request moves through a single enforced path — availability check, conflict detection, review, and notification — instead of relying on manual coordination.",
    hasCaseStudy: true,
    caseStudy: {
      context: [
        "ADA University's rooms and shared spaces were reserved informally — through messages, spreadsheets, and verbal agreements between students, staff, and USG (the university's student government, which reviews and approves space requests).",
        "That worked at low volume, but broke down as soon as two people wanted the same room, or a request needed sign-off from someone who wasn't in the conversation.",
      ],
      problem: [
        "The system needed a single source of truth for who has a room, when, and under what authority. That meant modeling three things that are easy to get wrong independently and much harder to get right together: time-based availability, an approval hierarchy, and notification state.",
        "A reservation is only correct if all three agree — a room can't be 'approved' if it was already booked in that window, and a user shouldn't be notified of a state the database hasn't actually committed to.",
      ],
      system: [
        "The backend is organized around a reservation lifecycle rather than a CRUD resource. A request doesn't just get 'created' — it moves through authorization, availability checking, conflict detection, and review before it becomes a committed reservation.",
        "Rooms, time slots, and reservations are modeled relationally so that overlap queries — 'is this room free between these two timestamps' — can be enforced at the database layer, not just checked in application code after the fact.",
        "Role-based access control separates what a regular user can request from what a USG reviewer can approve or reject, with the API surface reflecting that separation rather than trusting the client to enforce it.",
      ],
      engineeringChallenges: [
        "Time-overlap detection: determining whether a new request conflicts with any existing reservation for the same room, without false positives on adjacent (non-overlapping) bookings.",
        "Keeping reservation status, calendar availability, and notification delivery consistent — an approval that updates the database but fails to notify is a silent failure the user experiences as a broken system.",
        "Modeling an approval workflow as backend state rather than as a UI flag, so that 'pending', 'approved', and 'rejected' are enforced transitions instead of arbitrary field updates.",
      ],
      architecture: {
        steps: [
          "Reservation Request",
          "Availability Check",
          "Conflict Detection",
          "Approval",
          "Persistence (PostgreSQL)",
          "Notification",
        ],
      },
      secondaryDiagram: {
        label: "Reservation lifecycle",
        steps: [
          "User Request",
          "Authorization",
          "Availability Check",
          "Conflict Detection",
          "Pending Reservation",
          "USG Review",
          "Approved / Rejected",
          "Notification",
        ],
      },
      decisions: [
        {
          title: "Conflict detection at the query level",
          body: "Overlap checks are expressed as time-range queries rather than loading all reservations for a room and filtering in application code. This keeps correctness anchored to the database rather than to whatever the application happens to have loaded in memory.",
        },
        {
          title: "Approval as a distinct role, not a flag on the requester",
          body: "USG review is modeled as a separate authority in the system, not a boolean a user could plausibly set on their own request. The API enforces who is allowed to transition a reservation from pending to approved or rejected.",
        },
        {
          title: "Notifications as a consequence of committed state",
          body: "Emails are triggered after a reservation's status change is persisted, not alongside it — so a notification never claims a state the database hasn't actually reached.",
        },
      ],
      result: [
        "The result is a reservation platform where every request follows the same enforced path: authorization, availability, conflict detection, review, and notification — rather than depending on whoever happens to be coordinating manually.",
        "This is presented as a built system reflecting the ADA/USG reservation workflow, not as a deployed, university-wide production service.",
      ],
      learnings: [
        "Modeling a workflow as explicit states — not just database columns — makes the rules the system enforces legible, both to future code and to whoever is reviewing it.",
        "Most of the real difficulty in a 'simple' reservation system is concurrency and consistency, not the calendar UI on top of it.",
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
      "Worked within the MongoDB module of Testcontainers Java and added test coverage around initialization-script behavior, including a shouldRunInitScript() test — following the project's existing conventions and validating behavior through its Gradle test suite before preparing a pull request.",
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
      "A merged understanding of how to read, test, and extend a large, actively maintained open-source Java codebase under its own conventions — distinct from building a project from scratch.",
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
        "The outcome is a small, focused contribution — a test covering initialization-script behavior in the MongoDB module — prepared and submitted as a pull request against testcontainers-java.",
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
    status: "Prototype",
    groups: ["selected", "product"],
    tagline:
      "A retail analytics concept that evolved from a cashier-side scanning idea into a POS-integration approach, after field research showed retailers already had the infrastructure SCAN assumed it needed to build.",
    problem:
      "Independent and medium-sized retailers generate receipt-level transaction data that mostly goes unused — there's no simple layer that turns it into product- and basket-level analytics.",
    challenge:
      "The real challenge wasn't technical scanning — it was discovering, through retailer interviews, that the original mobile-scanning assumption was solving a problem that existing POS systems had already solved, and redirecting the approach accordingly.",
    architecture: {
      steps: [
        "POS",
        "Connector",
        "Transaction Ingestion",
        "Normalization",
        "Analytics",
        "Dashboard",
      ],
    },
    tech: ["React", "Supabase", "ZXing", "APIs", "Analytics Visualization"],
    result:
      "SCAN was selected among 200+ ideas at the Coca-Cola İçecek OneIdea innovation competition. It remains a prototype-stage concept that pivoted from mobile scanning toward POS integration after retailer research — not a deployed analytics product.",
    hasCaseStudy: true,
    caseStudy: {
      context: [
        "SCAN originated from the Coca-Cola İçecek OneIdea innovation competition, where it was selected among more than 200 submitted ideas.",
        "The starting premise: independent and medium-sized retailers sell products through a POS system, but the receipt-level data behind those sales — what sold, when, in what basket — is rarely turned into usable analytics.",
      ],
      problem: [
        "The first approach assumed retailers needed a new way to capture transaction data: cashier-side mobile barcode scanning, run alongside the existing checkout process.",
        "That assumption didn't survive contact with actual retailers.",
      ],
      system: [
        "Field interviews with retailers surfaced something the initial design hadn't accounted for: most of them already had POS systems generating exactly the transaction data SCAN was trying to capture through scanning.",
        "That discovery redirected the project from 'build a new data-capture mechanism' to 'integrate with data that already exists' — connecting to POS systems, ingesting receipt-level transactions, and normalizing them into a structure usable for analytics.",
        "The resulting architecture treats the POS as the source of truth: a connector layer reads transaction data, an ingestion step brings it into SCAN, normalization reconciles differing POS data formats, and an analytics layer turns normalized transactions into dashboards.",
      ],
      engineeringChallenges: [
        "Designing around real retailer infrastructure instead of the infrastructure the initial concept assumed would need to be built.",
        "Normalizing transaction data — receipt ID, barcode, product, quantity, price, timestamp — from POS sources that don't share a common format.",
        "Turning raw transaction ingestion into basket-level analytics rather than just a transaction log.",
      ],
      architecture: {
        steps: [
          "POS",
          "Connector",
          "Transaction Ingestion",
          "Normalization",
          "Analytics",
          "Dashboard",
        ],
      },
      secondaryDiagram: {
        label: "Concept evolution",
        steps: [
          "Initial Assumption",
          "Mobile Scanning Prototype",
          "Retailer Interviews",
          "Discovery of Existing POS Infrastructure",
          "Pivot to POS Integration",
          "Receipt Ingestion",
          "Analytics",
        ],
      },
      decisions: [
        {
          title: "Let field research override the original technical plan",
          body: "The mobile-scanning prototype was a reasonable first hypothesis, but retailer interviews made it clear the harder, more valuable problem was integration, not capture. The architecture changed to match what retailers actually had.",
        },
        {
          title: "Treat the POS as the system of record",
          body: "Rather than SCAN owning transaction capture, POS integration means SCAN is downstream of data retailers already trust, which reduces the operational burden on the retailer side.",
        },
      ],
      result: [
        "SCAN's competition recognition (selected among 200+ ideas at Coca-Cola İçecek OneIdea) reflects the strength of the problem and pivot, not a completed or deployed analytics product.",
        "The project remains at prototype stage: the architecture and data model are designed, and the mobile-scanning version was built and tested, but full POS-integrated ingestion and dashboards are not presented here as shipped or adopted by retailers.",
      ],
      learnings: [
        "The most valuable engineering decision in SCAN wasn't a line of code — it was being willing to discard a working prototype once research showed the underlying assumption was wrong.",
        "Product engineering and backend engineering meet here: the data model only makes sense once the integration point (POS, not a new scanning flow) is correct.",
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
    tech: ["Java", "Spring Boot", "PostgreSQL", "Spring Data JPA", "JWT", "REST", "Docker"],
    result:
      "A layered backend where controllers, services, and repositories each have one job — with authentication, validation, and exception handling enforced consistently across every endpoint.",
  },
  {
    slug: "onyx",
    title: "Onyx",
    eyebrow: "Peer-to-Peer Messaging",
    status: "Prototype",
    groups: ["backend"],
    tagline:
      "A peer-to-peer messaging project written in Go, exploring sockets, networking, and concurrency outside the request/response model.",
    problem:
      "Most of my backend work is request/response over HTTP — Onyx is a deliberate step outside that, into direct peer-to-peer communication.",
    challenge:
      "Handling concurrent socket connections and message delivery without the structure a web framework normally provides for free.",
    architecture: {
      steps: ["Peer", "Socket Connection", "Concurrent Handler", "Message Routing", "Peer"],
    },
    tech: ["Go", "Sockets", "Networking", "Concurrency"],
    result:
      "A working exploration of peer-to-peer networking and concurrency in Go — deliberately outside the Java/Spring stack, to understand networking closer to the transport layer.",
  },
  {
    slug: "pulsenote",
    title: "PulseNote",
    eyebrow: "Async AI Stand-up Assistant",
    status: "Prototype",
    groups: ["product"],
    tagline:
      "An asynchronous AI stand-up assistant — short voice updates are transcribed and summarized into structured team digests.",
    problem:
      "Synchronous stand-ups don't fit distributed or asynchronous teams well, but async text updates lose the low-effort speed of just talking.",
    challenge:
      "Turning unstructured voice input into a structured, consistent team summary reliably enough to be useful without editing.",
    architecture: {
      steps: ["Voice Update", "Processing / Transcription", "AI Summarization", "Structured Digest", "Team Communication"],
    },
    tech: ["AI Integrations", "Transcription", "Summarization", "Workflow Automation"],
    result:
      "A working prototype of the voice-to-digest pipeline, exploring AI-assisted workflow automation for async team communication.",
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
    tech: ["Weather Data", "Geospatial Data", "Computer Vision (explored)", "Risk Scoring"],
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
