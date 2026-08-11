export const categories = [
  "C# Fundamentals",
  "OOP & Design",
  "SOLID Principles",
  "Collections & Generics",
  "Async & Threading",
  ".NET Runtime & CLR",
  "Entity Framework",
  "ASP.NET Core",
  "Design Patterns",
  "Testing",
  "LLD (Low-Level Design)",
  "HLD (High-Level Design)",
  "System Design",
];

export const questions = [
  // ── C# Fundamentals ─────────────────────────────────────────────────────────
  {
    id: 1,
    category: "C# Fundamentals",
    difficulty: "Medium",
    question: "What is the difference between `value types` and `reference types` in C#?",
    answer: `**Value types** (struct, int, bool, enum, etc.) are stored on the **stack** and hold their data directly. Assigning a value type copies the data.

**Reference types** (class, interface, delegate, string, array) store a **reference** (pointer) on the stack that points to data on the **heap**. Assigning a reference type copies the reference, not the object itself.

Key implications:
- Modifying a copy of a value type doesn't affect the original.
- Modifying an object through a copied reference affects the original.
- \`string\` is a special immutable reference type — it behaves like a value type due to immutability.
- Use \`struct\` for small, short-lived, immutable data; prefer \`class\` otherwise.`,
    tags: ["types", "memory", "stack", "heap"],
  },
  {
    id: 2,
    category: "C# Fundamentals",
    difficulty: "Easy",
    question: "What is boxing and unboxing? Why can it be a performance concern?",
    answer: `**Boxing** is the implicit conversion of a value type to \`object\` (or to an interface type). The runtime allocates a new object on the heap and copies the value into it.

**Unboxing** is the explicit extraction of the value type from the boxed object back to its original form.

\`\`\`csharp
int x = 42;
object boxed = x;        // boxing  — heap allocation
int y = (int)boxed;      // unboxing — explicit cast required
\`\`\`

**Performance concerns:**
- Each boxing creates a heap allocation → GC pressure.
- In hot paths (tight loops, large collections) this can be significant.
- Avoid by using generics (e.g., \`List<int>\` instead of \`ArrayList\`).`,
    tags: ["boxing", "performance", "generics"],
  },
  {
    id: 3,
    category: "C# Fundamentals",
    difficulty: "Medium",
    question: "Explain `readonly` vs `const` in C#.",
    answer: `| | \`const\` | \`readonly\` |
|---|---|---|
| Evaluation | Compile-time | Runtime (or compile-time for primitives) |
| Where set | Declaration only | Declaration **or** constructor |
| Static? | Implicitly static | Can be instance or static |
| Types allowed | Primitive types, string, enum, null | Any type |
| Versioning | Inlined at call-site — recompile needed | Not inlined — safer for libraries |

\`\`\`csharp
const double Pi = 3.14159;        // compile-time constant

readonly DateTime _created;       // set once (in constructor)
public MyClass() { _created = DateTime.UtcNow; }
\`\`\`

Prefer \`readonly\` for library-level constants to avoid binary compatibility issues.`,
    tags: ["const", "readonly", "immutability"],
  },
  {
    id: 4,
    category: "C# Fundamentals",
    difficulty: "Medium",
    question: "What are nullable value types and the null-coalescing operator?",
    answer: `**Nullable value types** (\`T?\` / \`Nullable<T>\`) allow a value type to represent its normal range of values **plus** \`null\`.

\`\`\`csharp
int? age = null;
if (age.HasValue) Console.WriteLine(age.Value);
\`\`\`

**Null-coalescing (\`??\`)** returns the left-hand operand if it's not null, otherwise the right-hand operand:
\`\`\`csharp
int result = age ?? 0;   // 0 if age is null
\`\`\`

**Null-coalescing assignment (\`??=\`)** (C# 8+):
\`\`\`csharp
age ??= 18;   // assign 18 only if age is null
\`\`\`

**Null-conditional (\`?.\`)** short-circuits on null:
\`\`\`csharp
string? name = user?.Profile?.Name;
\`\`\``,
    tags: ["nullable", "null-safety", "operators"],
  },
  {
    id: 5,
    category: "C# Fundamentals",
    difficulty: "Hard",
    question: "How does `ref`, `out`, and `in` differ as parameter modifiers?",
    answer: `| Modifier | Must be initialised before call | Can be modified | Intent |
|---|---|---|---|
| \`ref\` | Yes | Yes | Pass by reference (read & write) |
| \`out\` | No | Yes (must assign) | Return multiple values |
| \`in\` | Yes | No (read-only ref) | Avoid copying large structs |

\`\`\`csharp
void Swap(ref int a, ref int b) { int t = a; a = b; b = t; }

bool TryParse(string s, out int result) {
    result = int.Parse(s); return true;
}

void Process(in LargeStruct data) { /* data is read-only */ }
\`\`\`

**\`ref return\` / \`ref local\`** (C# 7+) allow returning a reference to a variable, enabling in-place mutation of collection elements without copying.`,
    tags: ["ref", "out", "in", "parameters"],
  },
  {
    id: 6,
    category: "C# Fundamentals",
    difficulty: "Medium",
    question: "What are delegates, Func, Action, and Predicate?",
    answer: `A **delegate** is a type-safe function pointer. It can hold a reference to a method (or lambda) with a compatible signature.

\`\`\`csharp
delegate int MathOp(int x, int y);
MathOp add = (a, b) => a + b;
Console.WriteLine(add(3, 4)); // 7
\`\`\`

Built-in generic delegates:
- **\`Func<T, TResult>\`** — takes inputs, returns a value (\`Func<int,int,int>\` = two ints → int).
- **\`Action<T>\`** — takes inputs, returns void.
- **\`Predicate<T>\`** — takes \`T\`, returns \`bool\` (equivalent to \`Func<T, bool>\`).

**Multicast delegates** can hold multiple methods; invoking them calls all in order. Useful in event patterns.

Events (\`event\` keyword) wrap a delegate and restrict external code to only \`+=\` / \`-=\`.`,
    tags: ["delegates", "func", "action", "events", "lambdas"],
  },
  {
    id: 7,
    category: "C# Fundamentals",
    difficulty: "Medium",
    question: "Explain LINQ and deferred execution.",
    answer: `**LINQ (Language Integrated Query)** provides a uniform query syntax over any \`IEnumerable<T>\` or \`IQueryable<T>\`.

\`\`\`csharp
var seniors = employees
    .Where(e => e.Age > 50)
    .OrderBy(e => e.Name)
    .Select(e => e.Name);
\`\`\`

**Deferred (lazy) execution**: Most LINQ operators (Where, Select, OrderBy…) do **not** execute when the query is defined. They create an expression tree / iterator. Execution is triggered by:
- Iterating with \`foreach\`
- Calling \`ToList()\`, \`ToArray()\`, \`ToDictionary()\`
- Aggregation operators: \`Count()\`, \`Sum()\`, \`First()\`, \`Any()\`

**Implications:**
- Enumerating the same query twice executes it twice.
- If the source changes between enumerations, results differ.
- Use \`ToList()\` to materialise results when you need a snapshot.`,
    tags: ["linq", "deferred-execution", "ienumerable"],
  },

  // ── OOP & Design ─────────────────────────────────────────────────────────────
  {
    id: 8,
    category: "OOP & Design",
    difficulty: "Easy",
    question: "What are the four pillars of OOP and how does C# support them?",
    answer: `1. **Encapsulation** — bundling data and behaviour; controlling access via access modifiers (\`private\`, \`protected\`, \`internal\`, \`public\`). C# properties enforce encapsulation with get/set accessors.

2. **Inheritance** — a class can derive from one base class (\`class Dog : Animal\`). C# uses single inheritance for classes but supports multiple interface implementation.

3. **Polymorphism** — the ability to treat derived types as their base type. Achieved via:
   - **Method overriding** (\`virtual\` + \`override\`)
   - **Interfaces** (compile-time / runtime dispatch)
   - **Method overloading** (compile-time)

4. **Abstraction** — hiding complexity behind a well-defined interface. In C#: \`abstract\` classes (can have partial implementations) and \`interface\` (pure contract, C# 8+ allows default implementations).`,
    tags: ["oop", "inheritance", "encapsulation", "polymorphism"],
  },
  {
    id: 9,
    category: "OOP & Design",
    difficulty: "Medium",
    question: "Interface vs Abstract Class — when to use each?",
    answer: `| | Interface | Abstract Class |
|---|---|---|
| Instantiation | ❌ | ❌ |
| Multiple inheritance | ✅ (multiple) | ❌ (single) |
| Fields | ❌ (only properties/methods/events) | ✅ |
| Constructor | ❌ | ✅ |
| Default implementations | ✅ (C# 8+) | ✅ |
| Access modifiers on members | Limited (public by default) | Any |

**Use an interface when:**
- You want to define a contract any unrelated type can fulfill.
- You need multiple inheritance of type.
- You're designing a public API.

**Use an abstract class when:**
- You want to share implementation among closely related classes.
- You need constructors or fields.
- You want to express "is-a" relationships with shared base behaviour.`,
    tags: ["interface", "abstract", "oop"],
  },
  {
    id: 10,
    category: "OOP & Design",
    difficulty: "Medium",
    question: "What is the difference between `override`, `new`, and `virtual`?",
    answer: `- **\`virtual\`**: marks a base class method as overridable. The runtime dispatches to the most-derived override (runtime polymorphism).
- **\`override\`**: provides a new implementation for a \`virtual\` or \`abstract\` method in a derived class. Participates in polymorphic dispatch.
- **\`new\`** (method hiding): hides the base class method with a new implementation, but does **not** participate in polymorphic dispatch. The method called depends on the compile-time type of the variable.

\`\`\`csharp
class Base { public virtual void Speak() => Console.Write("Base"); }
class Child : Base { public override void Speak() => Console.Write("Child"); }
class Shadow : Base { public new void Speak() => Console.Write("Shadow"); }

Base b = new Child();
b.Speak();   // "Child" — override is polymorphic

Base s = new Shadow();
s.Speak();   // "Base" — new hides, not overrides
\`\`\``,
    tags: ["virtual", "override", "new", "polymorphism"],
  },

  // ── SOLID Principles ────────────────────────────────────────────────────────
  {
    id: 11,
    category: "SOLID Principles",
    difficulty: "Easy",
    question: "Explain each SOLID principle with a C# example.",
    answer: `**S — Single Responsibility Principle (SRP)**: A class should have only one reason to change.
\`\`\`csharp
// Bad: OrderService handles business logic AND email sending
// Good: Separate EmailService handles notifications
\`\`\`

**O — Open/Closed Principle (OCP)**: Open for extension, closed for modification. Use inheritance or composition to add behaviour without changing existing code.
\`\`\`csharp
abstract class Shape { public abstract double Area(); }
class Circle : Shape { public override double Area() => Math.PI * r * r; }
\`\`\`

**L — Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without altering program correctness.

**I — Interface Segregation Principle (ISP)**: Many specific interfaces are better than one general-purpose interface.
\`\`\`csharp
interface IPrinter { void Print(); }
interface IScanner { void Scan(); }
// Not: interface IMultiFunction { void Print(); void Scan(); void Fax(); }
\`\`\`

**D — Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules; both should depend on abstractions.
\`\`\`csharp
class OrderService {
    private readonly IEmailSender _sender;
    public OrderService(IEmailSender sender) { _sender = sender; }
}
\`\`\``,
    tags: ["solid", "srp", "ocp", "lsp", "isp", "dip"],
  },
  {
    id: 12,
    category: "SOLID Principles",
    difficulty: "Hard",
    question: "Give a concrete example of violating the Liskov Substitution Principle.",
    answer: `The classic example is **Square extends Rectangle**:

\`\`\`csharp
class Rectangle {
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }
    public int Area() => Width * Height;
}

class Square : Rectangle {
    public override int Width { set { base.Width = base.Height = value; } get => base.Width; }
    public override int Height { set { base.Width = base.Height = value; } get => base.Height; }
}

void SetDimensions(Rectangle r) {
    r.Width = 4;
    r.Height = 5;
    // Expects area = 20, but if r is a Square, area = 25!
    Debug.Assert(r.Area() == 20); // Fails for Square
}
\`\`\`

**Fix**: Don't inherit Square from Rectangle. Make both implement a common \`IShape\` interface without the dimension-setting contract.`,
    tags: ["lsp", "solid", "inheritance"],
  },

  // ── Collections & Generics ───────────────────────────────────────────────────
  {
    id: 13,
    category: "Collections & Generics",
    difficulty: "Medium",
    question: "When would you choose `List<T>`, `LinkedList<T>`, `Dictionary<K,V>`, `HashSet<T>`, and `Queue<T>`?",
    answer: `| Type | Backing Store | Access | Insert/Remove | Best For |
|---|---|---|---|---|
| \`List<T>\` | Dynamic array | O(1) index | O(n) middle, O(1) amortised end | General ordered collection |
| \`LinkedList<T>\` | Doubly linked | O(n) | O(1) at known node | Frequent mid-list inserts/removes |
| \`Dictionary<K,V>\` | Hash table | O(1) avg key | O(1) avg | Key-value lookup |
| \`HashSet<T>\` | Hash table | O(1) contains | O(1) avg | Unique items, set operations |
| \`Queue<T>\` | Circular buffer | O(1) Dequeue | O(1) Enqueue | FIFO processing |
| \`Stack<T>\` | Array | O(1) Pop | O(1) Push | LIFO / undo stacks |
| \`SortedDictionary<K,V>\` | Red-black tree | O(log n) | O(log n) | Sorted key lookup |

**ConcurrentXxx** variants (e.g., \`ConcurrentDictionary\`) are thread-safe alternatives.`,
    tags: ["collections", "list", "dictionary", "hashset"],
  },
  {
    id: 14,
    category: "Collections & Generics",
    difficulty: "Hard",
    question: "What is covariance and contravariance in generics?",
    answer: `**Covariance** (\`out\` keyword): a generic type parameter can be substituted with a more derived type. Safe for **output** positions (reading/producing).

\`\`\`csharp
IEnumerable<string> strings = new List<string>();
IEnumerable<object> objects = strings; // covariant — string is-a object
\`\`\`

**Contravariance** (\`in\` keyword): a generic type parameter can be substituted with a less derived type. Safe for **input** positions (writing/consuming).

\`\`\`csharp
Action<object> objAction = o => Console.WriteLine(o);
Action<string> strAction = objAction; // contravariant — Action<object> can handle string
\`\`\`

**Rules:**
- Only interfaces and delegates support variance.
- Classes are **invariant** by default.
- Covariant (\`out\`): type only appears in output position.
- Contravariant (\`in\`): type only appears in input position.`,
    tags: ["generics", "covariance", "contravariance"],
  },
  {
    id: 15,
    category: "Collections & Generics",
    difficulty: "Medium",
    question: "How does `IEnumerable<T>` differ from `IQueryable<T>`?",
    answer: `| | \`IEnumerable<T>\` | \`IQueryable<T>\` |
|---|---|---|
| Execution | In-memory (LINQ-to-Objects) | Provider-translated (e.g., SQL) |
| Expression trees | No | Yes |
| Best for | In-memory collections | Databases, remote sources |
| Filtering | Client-side (all data pulled first) | Server-side (WHERE in SQL) |

\`\`\`csharp
// IQueryable — generates: SELECT * FROM Users WHERE Age > 30
var q = dbContext.Users.Where(u => u.Age > 30);

// IEnumerable — loads ALL users, filters in C#
IEnumerable<User> e = dbContext.Users.AsEnumerable().Where(u => u.Age > 30);
\`\`\`

Always prefer \`IQueryable\` when querying a database to push filtering/sorting to the server.`,
    tags: ["ienumerable", "iqueryable", "linq", "ef"],
  },

  // ── Async & Threading ────────────────────────────────────────────────────────
  {
    id: 16,
    category: "Async & Threading",
    difficulty: "Hard",
    question: "How does `async`/`await` work under the hood?",
    answer: `The compiler transforms an \`async\` method into a **state machine** struct. Each \`await\` point becomes a state transition.

**Execution flow:**
1. Method runs synchronously until the first \`await\`.
2. If the awaited task is not yet complete, the remainder of the method is registered as a **continuation** and the calling thread is returned to the pool.
3. When the task completes, the continuation is scheduled (back on the original \`SynchronizationContext\` in UI apps, or any thread-pool thread in ASP.NET Core).

**Key points:**
- \`async void\` should only be used for event handlers — exceptions are unobservable.
- \`await\` unwraps the \`Task<T>\` result and re-throws exceptions.
- \`ConfigureAwait(false)\` avoids capturing the sync context — use in library code.
- Avoid \`.Result\` / \`.Wait()\` on async code — risks deadlock in UI/ASP.NET classic contexts.`,
    tags: ["async", "await", "state-machine", "task"],
  },
  {
    id: 17,
    category: "Async & Threading",
    difficulty: "Hard",
    question: "What is the difference between `Task`, `ValueTask`, and `Thread`?",
    answer: `**\`Thread\`**: OS-level thread. Heavy (1 MB stack by default). Explicit management needed. Rarely used directly in modern C#.

**\`Task\`** (TPL): represents an asynchronous operation. Backed by the thread pool. Heap-allocated — always has a GC cost even when completed synchronously.

**\`ValueTask\`** (C# 7+): a struct that avoids heap allocation in the common case where the async method completes synchronously. Best for high-frequency async paths (e.g., caching, hot loops).

\`\`\`csharp
// Prefer ValueTask when the result is often already available:
public ValueTask<int> ReadAsync() {
    if (_cache.TryGet(out int val)) return new ValueTask<int>(val);
    return new ValueTask<int>(ReadFromDiskAsync());
}
\`\`\`

**\`Thread\` vs \`Task\`**: Tasks use the thread pool and support continuations, cancellation, and exception propagation. Prefer Tasks for I/O-bound and CPU-bound work (use \`Task.Run\` for the latter).`,
    tags: ["task", "valuetask", "thread", "async"],
  },
  {
    id: 18,
    category: "Async & Threading",
    difficulty: "Hard",
    question: "Explain `lock`, `Monitor`, `Mutex`, `SemaphoreSlim`, and `Interlocked`.",
    answer: `**\`lock(obj)\`**: syntactic sugar for \`Monitor.Enter\`/\`Monitor.Exit\`. Single-process, single-threaded access to a critical section.

**\`Monitor\`**: lower-level, allows \`TryEnter\` with timeout, \`Wait\`/\`Pulse\` for thread signalling.

**\`Mutex\`**: OS-level synchronisation primitive. Can be named and used **across processes**. Heavier than \`lock\`.

**\`SemaphoreSlim\`**: limits concurrent access to a resource to N threads simultaneously. Supports \`await WaitAsync()\` — use for async throttling.

**\`Interlocked\`**: atomic operations (increment, compare-exchange) without locks. Fastest for simple counters.

\`\`\`csharp
private int _count;
Interlocked.Increment(ref _count); // atomic, no lock needed

private readonly SemaphoreSlim _sem = new(3); // max 3 concurrent
await _sem.WaitAsync();
try { await DoWorkAsync(); }
finally { _sem.Release(); }
\`\`\``,
    tags: ["threading", "lock", "semaphore", "synchronisation"],
  },
  {
    id: 19,
    category: "Async & Threading",
    difficulty: "Medium",
    question: "What is `CancellationToken` and how should it be used?",
    answer: `\`CancellationToken\` provides a cooperative cancellation mechanism. A \`CancellationTokenSource\` creates and controls the token.

\`\`\`csharp
var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30)); // auto-cancel
CancellationToken token = cts.Token;

try {
    await DoLongWorkAsync(token);
} catch (OperationCanceledException) {
    Console.WriteLine("Cancelled");
} finally {
    cts.Dispose();
}

async Task DoLongWorkAsync(CancellationToken ct) {
    for (int i = 0; i < 100; i++) {
        ct.ThrowIfCancellationRequested(); // check periodically
        await Task.Delay(100, ct);
    }
}
\`\`\`

**Best practices:**
- Always pass token to library methods that accept it (\`HttpClient\`, \`DbCommand\`, etc.).
- Use \`ThrowIfCancellationRequested()\` at loop checkpoints.
- Link tokens with \`CancellationTokenSource.CreateLinkedTokenSource\` when you need to cancel on either condition.`,
    tags: ["cancellationtoken", "async", "cancellation"],
  },

  // ── .NET Runtime & CLR ───────────────────────────────────────────────────────
  {
    id: 20,
    category: ".NET Runtime & CLR",
    difficulty: "Hard",
    question: "Explain the .NET Garbage Collector: generations, LOH, and GC modes.",
    answer: `The .NET GC is a **generational, mark-and-compact** collector.

**Generations:**
- **Gen 0**: short-lived objects. Collected most frequently (milliseconds).
- **Gen 1**: buffer between Gen 0 and Gen 2.
- **Gen 2**: long-lived objects (static, caches, large buffers). Full GC.

**Large Object Heap (LOH)**: objects ≥ 85,000 bytes. Collected with Gen 2. Not compacted by default (fragmentation risk). Use \`GCSettings.LargeObjectHeapCompactionMode\` to force compaction.

**GC Modes:**
- **Workstation GC**: single-threaded, lower latency.
- **Server GC**: one thread per logical CPU core, higher throughput — default in ASP.NET Core.
- **Concurrent/Background GC**: GC runs concurrently with application threads — reduces pause times.

**Tips for GC-friendly code:**
- Avoid allocations in hot paths (\`ArrayPool<T>\`, \`Span<T>\`, \`stackalloc\`).
- Implement \`IDisposable\` for unmanaged resources; finalizers delay GC.
- Use object pooling (\`ObjectPool<T>\`) for expensive objects.`,
    tags: ["gc", "clr", "memory", "performance"],
  },
  {
    id: 21,
    category: ".NET Runtime & CLR",
    difficulty: "Medium",
    question: "What is `IDisposable` and the Dispose pattern?",
    answer: `\`IDisposable\` is used to release **unmanaged resources** (file handles, DB connections, native memory) deterministically.

**Standard dispose pattern:**
\`\`\`csharp
public class ResourceHolder : IDisposable {
    private bool _disposed;
    private SafeHandle _handle = new SafeFileHandle(IntPtr.Zero, true);

    public void Dispose() {
        Dispose(disposing: true);
        GC.SuppressFinalize(this); // prevent finalizer from running
    }

    protected virtual void Dispose(bool disposing) {
        if (_disposed) return;
        if (disposing) _handle?.Dispose(); // managed resources
        // free unmanaged resources here
        _disposed = true;
    }

    ~ResourceHolder() => Dispose(disposing: false); // finalizer fallback
}
\`\`\`

**\`using\` statement** calls \`Dispose\` automatically (even on exception):
\`\`\`csharp
using var conn = new SqlConnection(cs); // C# 8 using declaration
\`\`\`

**\`IAsyncDisposable\`** (C# 8+) for async cleanup:
\`\`\`csharp
await using var writer = new StreamWriter(path);
\`\`\``,
    tags: ["idisposable", "dispose", "clr", "unmanaged"],
  },
  {
    id: 22,
    category: ".NET Runtime & CLR",
    difficulty: "Hard",
    question: "What is `Span<T>` and `Memory<T>`, and why do they improve performance?",
    answer: `**\`Span<T>\`**: a ref struct that provides a **type-safe, allocation-free view** over contiguous memory (arrays, stack, unmanaged memory). Because it's a ref struct, it can **only** live on the stack — it cannot be stored in fields, heap-allocated, or used across await points.

**\`Memory<T>\`**: a struct (not ref struct) that wraps contiguous memory. Can be stored in fields, passed across async boundaries. Has more overhead than \`Span<T>\`.

**Why they improve performance:**
- Slice operations create a new Span over existing memory without allocation.
- Replace \`string.Substring\` (allocates) with \`AsSpan()[start..end]\` (zero allocation).
- Enable zero-copy parsing and buffer manipulation.

\`\`\`csharp
ReadOnlySpan<char> span = "hello world".AsSpan();
ReadOnlySpan<char> hello = span[..5]; // no allocation

// stackalloc with Span
Span<int> buffer = stackalloc int[128];
\`\`\``,
    tags: ["span", "memory", "performance", "zero-allocation"],
  },

  // ── Entity Framework ─────────────────────────────────────────────────────────
  {
    id: 23,
    category: "Entity Framework",
    difficulty: "Medium",
    question: "What is the difference between eager, lazy, and explicit loading in EF Core?",
    answer: `**Eager loading**: related data is loaded as part of the initial query using \`Include()\`.
\`\`\`csharp
var orders = db.Orders.Include(o => o.Items).ThenInclude(i => i.Product).ToList();
\`\`\`

**Lazy loading**: related data is loaded automatically on first access. Requires proxy generation (\`UseLazyLoadingProxies()\`) or the \`ILazyLoader\` service. Risk: N+1 query problem.
\`\`\`csharp
// Accessing order.Items triggers a new DB query each time in a loop
\`\`\`

**Explicit loading**: manually load related data when needed.
\`\`\`csharp
db.Entry(order).Collection(o => o.Items).Load();
db.Entry(order).Reference(o => o.Customer).Load();
\`\`\`

**Prefer eager loading** for known required relationships. Use explicit loading when the relationship is conditionally needed. Avoid lazy loading in web APIs — it can mask N+1 issues.`,
    tags: ["ef-core", "loading", "n+1", "database"],
  },
  {
    id: 24,
    category: "Entity Framework",
    difficulty: "Hard",
    question: "Explain EF Core change tracking and when to use `AsNoTracking()`.",
    answer: `By default, EF Core **tracks** all entities returned from queries. The change tracker records the original state of each entity so \`SaveChanges()\` can generate the correct UPDATE/DELETE SQL.

**Overhead:** tracking uses memory and CPU (object snapshots).

**\`AsNoTracking()\`**: entities are returned without being registered in the change tracker. Use it for **read-only queries** where you won't update the entities.

\`\`\`csharp
// Read-only dashboard query — no need to track
var reports = db.Orders.AsNoTracking()
    .Where(o => o.Date > lastMonth)
    .Select(o => new { o.Id, o.Total })
    .ToList();

// Must track to update
var order = db.Orders.Find(id);
order.Status = OrderStatus.Shipped;
db.SaveChanges(); // generates UPDATE
\`\`\`

**\`AsNoTrackingWithIdentityResolution()\`** (EF Core 5+): no tracking, but still deduplicates related entities by identity — useful for projections with navigation properties.`,
    tags: ["ef-core", "change-tracking", "performance"],
  },

  // ── ASP.NET Core ─────────────────────────────────────────────────────────────
  {
    id: 25,
    category: "ASP.NET Core",
    difficulty: "Medium",
    question: "Explain the ASP.NET Core middleware pipeline.",
    answer: `The middleware pipeline is a series of components that process HTTP requests and responses. Each middleware can:
1. Execute code before the next component.
2. Call \`next()\` to pass control to the next middleware.
3. Execute code after the next component returns (on the way back).

\`\`\`csharp
app.UseHttpsRedirection();     // redirects HTTP → HTTPS
app.UseStaticFiles();          // serves static files, short-circuits
app.UseRouting();              // matches endpoint
app.UseAuthentication();       // populates HttpContext.User
app.UseAuthorization();        // checks permissions
app.MapControllers();          // executes controller action
\`\`\`

**Order matters**: e.g., Authentication must come before Authorization.

**Short-circuiting**: a middleware can return a response without calling \`next()\` (e.g., static files, caching).

Custom middleware:
\`\`\`csharp
app.Use(async (context, next) => {
    // before
    await next(context);
    // after — response has been written
});
\`\`\``,
    tags: ["aspnet-core", "middleware", "pipeline"],
  },
  {
    id: 26,
    category: "ASP.NET Core",
    difficulty: "Medium",
    question: "What are the three lifetimes in ASP.NET Core DI and when to use each?",
    answer: `**Transient** (\`AddTransient\`): a new instance is created **every time** it is requested. Use for lightweight, stateless services.

**Scoped** (\`AddScoped\`): a new instance per **HTTP request** (or per scope). The same instance is used throughout the request. Use for DbContext, unit-of-work, per-request caches.

**Singleton** (\`AddSingleton\`): a single instance for the **application lifetime**. Use for stateless, thread-safe services (caches, config, HttpClient factory).

**Captive dependency problem**: if a Singleton depends on a Scoped service, the scoped instance lives as long as the singleton (longer than one request) — this is a bug. ASP.NET Core will throw an \`InvalidOperationException\` if scope validation is enabled (default in Development).

\`\`\`csharp
services.AddDbContext<AppDbContext>(/* scoped by default */);
services.AddSingleton<IMemoryCache, MemoryCache>();
services.AddTransient<IEmailSender, SmtpEmailSender>();
\`\`\``,
    tags: ["di", "dependency-injection", "aspnet-core", "lifetimes"],
  },
  {
    id: 27,
    category: "ASP.NET Core",
    difficulty: "Hard",
    question: "How does minimal API differ from controller-based API in ASP.NET Core?",
    answer: `**Controller-based API** (MVC):
- Classes inherit from \`ControllerBase\` with \`[ApiController]\` attribute.
- Actions discovered by convention or attributes.
- Built-in model binding, validation, filters.
- Better for large APIs with complex logic, versioning, and conventions.

**Minimal API** (ASP.NET Core 6+):
- Route handlers defined directly on \`WebApplication\`.
- Less ceremony, faster startup, fewer allocations.
- Supports route groups, filters, OpenAPI.

\`\`\`csharp
// Minimal API
app.MapGet("/users/{id}", async (int id, IUserService svc) =>
    await svc.GetByIdAsync(id) is User u ? Results.Ok(u) : Results.NotFound());

// Controller API
[HttpGet("{id}")]
public async Task<ActionResult<User>> Get(int id) => await _svc.GetByIdAsync(id);
\`\`\`

Choose minimal API for microservices and simple CRUD; controller-based for enterprise apps requiring rich filter pipelines, versioning, and team conventions.`,
    tags: ["aspnet-core", "minimal-api", "controllers", "api"],
  },

  // ── Design Patterns ─────────────────────────────────────────────────────────
  {
    id: 28,
    category: "Design Patterns",
    difficulty: "Medium",
    question: "Explain the Repository and Unit of Work patterns.",
    answer: `**Repository pattern** abstracts data access behind an interface, decoupling business logic from the data layer.

\`\`\`csharp
public interface IOrderRepository {
    Task<Order?> GetByIdAsync(int id);
    Task AddAsync(Order order);
}

public class EfOrderRepository : IOrderRepository {
    private readonly AppDbContext _db;
    public EfOrderRepository(AppDbContext db) => _db = db;
    public Task<Order?> GetByIdAsync(int id) => _db.Orders.FindAsync(id).AsTask();
    public Task AddAsync(Order order) => _db.Orders.AddAsync(order).AsTask();
}
\`\`\`

**Unit of Work (UoW)** coordinates multiple repositories and flushes all changes in a single transaction.

\`\`\`csharp
public interface IUnitOfWork : IDisposable {
    IOrderRepository Orders { get; }
    ICustomerRepository Customers { get; }
    Task<int> CommitAsync();
}
\`\`\`

**Note**: EF Core's \`DbContext\` already implements UoW and Repository implicitly. Additional wrapper repositories are often redundant unless you need testability without EF.`,
    tags: ["repository", "unit-of-work", "patterns", "ef"],
  },
  {
    id: 29,
    category: "Design Patterns",
    difficulty: "Medium",
    question: "What is the Decorator pattern and how does C# support it?",
    answer: `The **Decorator** pattern attaches additional behaviour to an object dynamically by wrapping it in a class that implements the same interface.

\`\`\`csharp
public interface IMessageService {
    Task SendAsync(string msg);
}

public class EmailService : IMessageService {
    public Task SendAsync(string msg) => /* send email */ Task.CompletedTask;
}

// Decorator adds logging without modifying EmailService
public class LoggingMessageService : IMessageService {
    private readonly IMessageService _inner;
    private readonly ILogger _log;

    public LoggingMessageService(IMessageService inner, ILogger<LoggingMessageService> log) {
        _inner = inner; _log = log;
    }

    public async Task SendAsync(string msg) {
        _log.LogInformation("Sending: {Msg}", msg);
        await _inner.SendAsync(msg);
        _log.LogInformation("Sent");
    }
}
\`\`\`

Registers in DI:
\`\`\`csharp
services.AddSingleton<IMessageService>(sp =>
    new LoggingMessageService(new EmailService(), sp.GetRequiredService<ILogger<...>>()));
\`\`\`

ASP.NET Core middleware is a classic example of the Decorator pattern.`,
    tags: ["decorator", "patterns", "di"],
  },
  {
    id: 30,
    category: "Design Patterns",
    difficulty: "Medium",
    question: "Explain the CQRS pattern and how it applies to .NET.",
    answer: `**CQRS (Command Query Responsibility Segregation)** separates read (Query) and write (Command) operations into distinct models.

- **Commands** mutate state and return void or a minimal result.
- **Queries** return data and do not mutate state.

This enables optimised read and write models, independent scaling, and clear separation of concerns.

**MediatR** is the de-facto library for CQRS in .NET:

\`\`\`csharp
// Command
public record CreateOrderCommand(string CustomerId, List<OrderItem> Items) : IRequest<Guid>;

// Handler
public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Guid> {
    public async Task<Guid> Handle(CreateOrderCommand cmd, CancellationToken ct) {
        var order = new Order(cmd.CustomerId, cmd.Items);
        await _db.Orders.AddAsync(order, ct);
        await _db.SaveChangesAsync(ct);
        return order.Id;
    }
}

// Dispatch
var orderId = await _mediator.Send(new CreateOrderCommand(customerId, items));
\`\`\`

Pair with **Event Sourcing** for an audit log of all state changes.`,
    tags: ["cqrs", "mediatr", "patterns", "architecture"],
  },

  // ── Testing ───────────────────────────────────────────────────────────────────
  {
    id: 31,
    category: "Testing",
    difficulty: "Medium",
    question: "What are the differences between unit, integration, and end-to-end tests?",
    answer: `| Type | Scope | Dependencies | Speed | Confidence |
|---|---|---|---|---|
| Unit | Single class/method | Mocked/stubbed | Very fast | Low (isolated) |
| Integration | Multiple layers | Real (DB, services) | Moderate | Medium |
| E2E | Full system | Real infrastructure | Slow | High |

**Unit tests**: test logic in isolation. Mock everything external. Use xUnit, NUnit, or MSTest with Moq/NSubstitute.

**Integration tests**: test multiple components together (e.g., controller → service → database). ASP.NET Core provides \`WebApplicationFactory<T>\` for in-process integration testing.

**E2E tests**: drive the UI or API from the outside (Playwright, Selenium, RestSharp).

**Test pyramid**: many unit tests, fewer integration tests, very few E2E tests.

\`\`\`csharp
// xUnit unit test with Moq
[Fact]
public async Task GetOrder_ReturnsOrder_WhenFound() {
    var repo = new Mock<IOrderRepository>();
    repo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Order { Id = 1 });
    var svc = new OrderService(repo.Object);
    var result = await svc.GetOrderAsync(1);
    Assert.Equal(1, result.Id);
}
\`\`\``,
    tags: ["testing", "unit-test", "integration-test", "xunit", "moq"],
  },
  {
    id: 32,
    category: "Testing",
    difficulty: "Hard",
    question: "How do you write integration tests for ASP.NET Core using `WebApplicationFactory`?",
    answer: `\`WebApplicationFactory<TEntryPoint>\` (from \`Microsoft.AspNetCore.Mvc.Testing\`) spins up your app in-process, allowing you to make real HTTP calls against it without spinning up a server.

\`\`\`csharp
public class OrdersApiTests : IClassFixture<WebApplicationFactory<Program>> {
    private readonly HttpClient _client;

    public OrdersApiTests(WebApplicationFactory<Program> factory) {
        _client = factory
            .WithWebHostBuilder(builder => {
                builder.ConfigureServices(services => {
                    // Replace DB with in-memory or SQLite for tests
                    services.RemoveAll<DbContextOptions<AppDbContext>>();
                    services.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase("TestDb"));
                });
            })
            .CreateClient();
    }

    [Fact]
    public async Task GetOrders_Returns200() {
        var response = await _client.GetAsync("/api/orders");
        response.EnsureSuccessStatusCode();
    }
}
\`\`\`

**Tips:**
- Use \`IAlternateScoped\` / \`RespawnAsync\` (Respawn library) to reset the database between tests.
- Use \`CustomWebApplicationFactory\` as a base class to share configuration.
- Set \`ASPNETCORE_ENVIRONMENT=Testing\` to load test appsettings.`,
    tags: ["testing", "integration-test", "aspnet-core", "webapplicationfactory"],
  },

  // ── SOLID Principles (additional) ───────────────────────────────────────
  {
    id: 33,
    category: "SOLID Principles",
    difficulty: "Hard",
    question: "Explain the Interface Segregation Principle with a real-world .NET example. When does violating it cause pain?",
    answer: `**Interface Segregation Principle (ISP):** Clients should not be forced to depend on methods they do not use. Split fat interfaces into narrow, role-specific ones.

### The anti-pattern: fat interface
\`\`\`csharp
// ❌ Forces every implementor to deal with all concerns
public interface IOrderService {
    Task<Order> GetOrderAsync(Guid id);
    Task<IReadOnlyList<Order>> SearchOrdersAsync(OrderQuery query);
    Task PlaceOrderAsync(PlaceOrderCommand cmd);
    Task CancelOrderAsync(Guid id);
    Task RefundAsync(Guid orderId, decimal amount);
    Task ExportToCsvAsync(Stream dest);
    Task SendConfirmationEmailAsync(Guid orderId);
}
\`\`\`
A read-only reporting service is forced to implement \`PlaceOrderAsync\`, \`RefundAsync\`, and email methods it should never touch — typically by throwing \`NotImplementedException\`, which is a runtime landmine.

### ISP-compliant decomposition
\`\`\`csharp
public interface IOrderReader {
    Task<Order> GetOrderAsync(Guid id);
    Task<IReadOnlyList<Order>> SearchOrdersAsync(OrderQuery query);
}

public interface IOrderWriter {
    Task PlaceOrderAsync(PlaceOrderCommand cmd);
    Task CancelOrderAsync(Guid id);
}

public interface IOrderRefund  { Task RefundAsync(Guid orderId, decimal amount); }
public interface IOrderExport  { Task ExportToCsvAsync(Stream dest); }
public interface IOrderNotifier { Task SendConfirmationEmailAsync(Guid orderId); }
\`\`\`
Each consumer depends only on what it needs:
\`\`\`csharp
// Report controller only needs reading
public class OrderReportController(IOrderReader reader) { ... }

// Checkout only needs writing + notification
public class CheckoutService(IOrderWriter writer, IOrderNotifier notifier) { ... }

// Refund processor only needs the refund contract
public class RefundProcessor(IOrderRefund refund) { ... }
\`\`\`

### Real pain from violations
1. **Compilation coupling**: change one unrelated method signature → recompile every class that implements the fat interface.
2. **Mocking bloat**: unit tests must set up dozens of irrelevant mock stubs — obscuring intent and slowing maintenance.
3. **Parallel teams**: two squads editing the same fat interface creates constant merge conflicts.
4. **Liskov breaks at runtime**: \`NotImplementedException\` thrown because someone implemented a method they never needed.

### Senior guidance
- Prefer **role interfaces** (named by capability: *IReadable*, *IWritable*, *INotifiable*) over **header interfaces** (one interface per class).
- In ASP.NET Core, register each narrow interface separately so consumers inject only what they need.
- ISP and DIP are complementary: narrow interfaces are easier to substitute with alternative implementations (DI containers, fakes, decorators).
- Don't over-split either — one interface per single method often creates "interface soup." Aim for cohesive, role-sized contracts.`,
    tags: ["isp", "solid", "interfaces", "dependency-injection"],
  },
  {
    id: 34,
    category: "SOLID Principles",
    difficulty: "Hard",
    question: "How does the Dependency Inversion Principle work in practice in .NET? Walk through a concrete refactoring.",
    answer: `**Dependency Inversion Principle (DIP):**
1. High-level modules should not depend on low-level modules. Both should depend on **abstractions**.
2. Abstractions should not depend on details. Details should depend on abstractions.

### Before DIP — tight coupling
\`\`\`csharp
// ❌ High-level business logic hard-wired to infrastructure
public class OrderService {
    private readonly SqlOrderRepository _repo = new SqlOrderRepository();   // direct instantiation
    private readonly SmtpEmailSender    _mail = new SmtpEmailSender();

    public async Task PlaceOrderAsync(Cart cart) {
        var order = Order.From(cart);
        await _repo.SaveAsync(order);          // depends on SQL detail
        await _mail.SendAsync(order.Email, …); // depends on SMTP detail
    }
}
\`\`\`
Problems: untestable without a real database + SMTP server; swapping to a different store/mailer requires editing the business class.

### After DIP — depend on abstractions
\`\`\`csharp
// Abstractions owned by the domain layer
public interface IOrderRepository { Task SaveAsync(Order order); }
public interface IEmailSender      { Task SendAsync(string to, string subject, string body); }

// High-level module depends ONLY on abstractions
public class OrderService {
    private readonly IOrderRepository _repo;
    private readonly IEmailSender     _mail;

    public OrderService(IOrderRepository repo, IEmailSender mail)
        => (_repo, _mail) = (repo, mail);       // injected — never newed up

    public async Task PlaceOrderAsync(Cart cart) {
        var order = Order.From(cart);
        await _repo.SaveAsync(order);
        await _mail.SendAsync(order.Email, "Confirmation", …);
    }
}

// Infrastructure details depend on the abstraction
public class SqlOrderRepository  : IOrderRepository { … }
public class SmtpEmailSender     : IEmailSender      { … }
public class SendGridEmailSender : IEmailSender      { … }  // swap in with zero domain change
\`\`\`

### Wire up via ASP.NET Core DI
\`\`\`csharp
builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();
builder.Services.AddScoped<IEmailSender,     SmtpEmailSender>();
builder.Services.AddScoped<OrderService>();
\`\`\`
In tests: swap \`SmtpEmailSender\` for \`FakeEmailSender\` or a Moq mock — zero changes to \`OrderService\`.

### Dependency direction rule
\`\`\`
Domain Layer  (defines IOrderRepository, IEmailSender)  ←  no dependency on infrastructure
Infrastructure Layer (SqlOrderRepository, SmtpEmailSender)  →  depends on domain abstractions
\`\`\`
**The interface is owned by the consumer, not the implementor.** This is the key insight that distinguishes DIP from plain dependency injection.

### Senior nuances
- **DI container ≠ DIP**: you can use \`new\` everywhere inside a DI container and still violate DIP. The principle is about *ownership of abstractions*, not just constructor injection.
- **Avoid anemic abstractions**: don't create \`ISqlOrderRepository\` — that's a leaky abstraction, not an inversion. Abstract over *what the business needs*, not *how the database works*.
- **Circular dependencies**: DIP naturally prevents them — the domain doesn't know about infrastructure, so there's no cycle.
- **Over-abstracting**: tiny helper classes (e.g., \`IStringFormatter\`) rarely warrant inversion. Reserve DIP for cross-cutting concerns (persistence, messaging, external services).`,
    tags: ["dip", "solid", "dependency-injection", "abstractions", "testability"],
  },
  {
    id: 35,
    category: "SOLID Principles",
    difficulty: "Hard",
    question: "Describe the Open/Closed Principle with a real extension-point example in C#. How do design patterns enforce it?",
    answer: `**Open/Closed Principle (OCP):** Software entities should be **open for extension** but **closed for modification**. Add new behaviour by adding new code — not by editing existing, tested code.

### Classic violation — switch/if ladder
\`\`\`csharp
// ❌ Every new payment type forces editing this class
public class PaymentProcessor {
    public void Process(Payment p) {
        if (p.Type == "CreditCard")  ProcessCreditCard(p);
        else if (p.Type == "PayPal") ProcessPayPal(p);
        else if (p.Type == "Crypto") ProcessCrypto(p);   // had to open the file
        // adding "BankTransfer" requires another edit here
    }
}
\`\`\`

### OCP-compliant — polymorphic extension
\`\`\`csharp
// Closed abstraction
public interface IPaymentHandler {
    bool CanHandle(string paymentType);
    Task HandleAsync(Payment payment);
}

// Each type is a new class — existing code never touched
public class CreditCardHandler : IPaymentHandler {
    public bool CanHandle(string t) => t == "CreditCard";
    public async Task HandleAsync(Payment p) { /* ... */ }
}
public class PayPalHandler : IPaymentHandler {
    public bool CanHandle(string t) => t == "PayPal";
    public async Task HandleAsync(Payment p) { /* ... */ }
}

// Orchestrator is closed for modification — just add a new handler to DI
public class PaymentProcessor {
    private readonly IEnumerable<IPaymentHandler> _handlers;
    public PaymentProcessor(IEnumerable<IPaymentHandler> handlers) => _handlers = handlers;

    public async Task ProcessAsync(Payment payment) {
        var handler = _handlers.FirstOrDefault(h => h.CanHandle(payment.Type))
            ?? throw new InvalidOperationException($"No handler for {payment.Type}");
        await handler.HandleAsync(payment);
    }
}
\`\`\`
Register in DI — adding \`BankTransferHandler\` requires zero edits to \`PaymentProcessor\`:
\`\`\`csharp
builder.Services.AddScoped<IPaymentHandler, CreditCardHandler>();
builder.Services.AddScoped<IPaymentHandler, PayPalHandler>();
builder.Services.AddScoped<IPaymentHandler, BankTransferHandler>(); // new, nothing else changes
\`\`\`

### Design patterns that enforce OCP
| Pattern | Extension mechanism |
|---|---|
| **Strategy** | Swap algorithms without touching context |
| **Decorator** | Add behaviour by wrapping, not inheriting |
| **Template Method** | Subclass overrides steps, base stays closed |
| **Chain of Responsibility** | Add new handlers without modifying the chain |
| **Visitor** | Add operations to a type hierarchy without modifying types |

### Practical senior guidance
- OCP does **not** mean "never modify code." It means stabilise your *core abstractions* and extend via *variation points*.
- You can't predict every future requirement — apply OCP where volatility is known or observed. Premature over-engineering is the opposite mistake.
- **Sealed classes** enforce closure: if a class is sealed, callers can't break it by subclassing, and you signal that extension should go through interfaces, not inheritance.
- MediatR pipeline behaviours are a great real-world example: add cross-cutting concerns (logging, validation, caching) as new \`IPipelineBehavior<,>\` classes without touching any handler.`,
    tags: ["ocp", "solid", "strategy-pattern", "polymorphism", "extension-points"],
  },

  // ── Design Patterns (additional) ─────────────────────────────────────────
  {
    id: 36,
    category: "Design Patterns",
    difficulty: "Hard",
    question: "Explain the Mediator pattern and how MediatR implements it in .NET. What are its trade-offs?",
    answer: `**Mediator** centralises communication between objects so they don't refer to each other directly, reducing coupling. Objects send messages to the mediator; it decides who handles them.

### Core problem without Mediator
A \`CheckoutController\` directly calls \`InventoryService\`, \`PaymentService\`, \`EmailService\`, \`LoyaltyService\` — it knows about and depends on all four. Adding fraud detection means editing the controller.

### MediatR implementation
\`\`\`csharp
// 1. Define a request (command or query) — pure data object
public record PlaceOrderCommand(Guid CustomerId, IReadOnlyList<CartItem> Items)
    : IRequest<OrderId>;

// 2. Handler — the only class that knows how to process it
public class PlaceOrderHandler : IRequestHandler<PlaceOrderCommand, OrderId> {
    private readonly IOrderRepository _orders;
    private readonly IInventoryService _inventory;

    public PlaceOrderHandler(IOrderRepository orders, IInventoryService inventory)
        => (_orders, _inventory) = (orders, inventory);

    public async Task<OrderId> Handle(PlaceOrderCommand cmd, CancellationToken ct) {
        await _inventory.ReserveAsync(cmd.Items, ct);
        var order = Order.Create(cmd.CustomerId, cmd.Items);
        await _orders.SaveAsync(order, ct);
        return order.Id;
    }
}

// 3. Controller — only knows about IMediator, never about handlers
[ApiController]
public class OrdersController(IMediator mediator) : ControllerBase {
    [HttpPost]
    public async Task<IActionResult> Post(PlaceOrderRequest req) {
        var id = await mediator.Send(new PlaceOrderCommand(req.CustomerId, req.Items));
        return CreatedAtAction(nameof(Get), new { id }, null);
    }
}
\`\`\`

### Pipeline behaviours — the killer feature
Cross-cutting concerns (logging, validation, transactions) as composable middleware:
\`\`\`csharp
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct) {
        var failures = _validators
            .SelectMany(v => v.Validate(request).Errors)
            .Where(e => e != null)
            .ToList();
        if (failures.Any()) throw new ValidationException(failures);
        return await next();
    }
}
\`\`\`
Register once; applies to every command/query automatically — no controller touches it.

### Trade-offs

| ✅ Pros | ⚠️ Cons |
|---|---|
| Controllers/services stay thin | Handlers can become a "god class" dumping ground |
| Easy to add cross-cutting concerns via behaviours | Indirection — harder to trace call flow |
| Each handler is independently testable | Over-use leads to "everything is a handler" |
| Natural fit for CQRS separation | Runtime exception if handler not registered |

### Senior guidance
- Mediator shines in **CQRS** architectures where commands and queries have different consistency needs.
- Don't use it for *every* method call — it adds indirection where direct service calls are clearer.
- Combine with **domain events** (publish \`INotification\`) for loosely coupled side effects (send email after order placed) without coupling the handler to the email service.
- Consider \`IRequest\` vs \`INotification\`: commands return a value; notifications are fire-and-forget with multiple handlers.`,
    tags: ["mediator", "mediatr", "cqrs", "pipeline", "design-patterns"],
  },
  {
    id: 37,
    category: "Design Patterns",
    difficulty: "Hard",
    question: "Explain the Decorator pattern vs inheritance for extending behaviour. Demonstrate with a real C# example.",
    answer: `**Decorator** attaches additional responsibilities to an object *dynamically* by wrapping it with another object that implements the same interface. It favours composition over inheritance.

### Why not inheritance?
\`\`\`csharp
// ❌ Inheritance explosion — cross-cutting combinations require N×M subclasses
class CachingOrderRepository      : SqlOrderRepository { ... }
class LoggingOrderRepository      : SqlOrderRepository { ... }
class CachingLoggingOrderRepository : SqlOrderRepository { ... } // combinatorial explosion
\`\`\`
Each cross-cutting combination needs a new class. You can't mix-and-match at runtime.

### Decorator pattern
\`\`\`csharp
// The interface both the real object and decorators implement
public interface IOrderRepository {
    Task<Order?> GetAsync(Guid id);
    Task SaveAsync(Order order);
}

// Real implementation
public class SqlOrderRepository : IOrderRepository {
    private readonly AppDbContext _db;
    public SqlOrderRepository(AppDbContext db) => _db = db;
    public async Task<Order?> GetAsync(Guid id) => await _db.Orders.FindAsync(id);
    public async Task SaveAsync(Order order)   => await _db.SaveChangesAsync();
}

// Caching decorator — wraps any IOrderRepository
public class CachingOrderRepository : IOrderRepository {
    private readonly IOrderRepository   _inner;
    private readonly IMemoryCache       _cache;
    public CachingOrderRepository(IOrderRepository inner, IMemoryCache cache)
        => (_inner, _cache) = (inner, cache);

    public async Task<Order?> GetAsync(Guid id) {
        if (_cache.TryGetValue(id, out Order? hit)) return hit;
        var order = await _inner.GetAsync(id);
        if (order is not null) _cache.Set(id, order, TimeSpan.FromMinutes(5));
        return order;
    }
    public async Task SaveAsync(Order order) {
        await _inner.SaveAsync(order);
        _cache.Remove(order.Id);          // invalidate on write
    }
}

// Logging decorator — wraps any IOrderRepository (including the caching one!)
public class LoggingOrderRepository : IOrderRepository {
    private readonly IOrderRepository _inner;
    private readonly ILogger<LoggingOrderRepository> _logger;
    public LoggingOrderRepository(IOrderRepository inner, ILogger<LoggingOrderRepository> logger)
        => (_inner, _logger) = (inner, logger);

    public async Task<Order?> GetAsync(Guid id) {
        _logger.LogDebug("GetAsync {Id}", id);
        var result = await _inner.GetAsync(id);
        _logger.LogDebug("GetAsync {Id} → {Found}", id, result is not null);
        return result;
    }
    public async Task SaveAsync(Order order) {
        _logger.LogInformation("SaveAsync {Id}", order.Id);
        await _inner.SaveAsync(order);
    }
}
\`\`\`

### Compose at registration time
\`\`\`csharp
// ASP.NET Core Scrutor library makes this fluent
builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();
builder.Services.Decorate<IOrderRepository, CachingOrderRepository>();
builder.Services.Decorate<IOrderRepository, LoggingOrderRepository>();
// Resolution order: LoggingOrderRepository → CachingOrderRepository → SqlOrderRepository
\`\`\`
Add, remove, or reorder decorators in *one place* — no changes to consumers or the real repository.

### Key differences vs inheritance

| | Decorator | Inheritance |
|---|---|---|
| When decided | Runtime / DI composition | Compile time |
| Combines N behaviours | N separate classes | N×M subclasses |
| Modifies original? | No | Can break LSP |
| Replaces behaviour | Wraps only | Can override entirely |

### Real-world .NET usages
- **HttpClient** delegating handlers (\`DelegatingHandler\`) — Polly retry, authentication headers
- **Stream** decorators — \`BufferedStream(new GZipStream(new FileStream(...)))\`
- **MediatR** pipeline behaviours (effectively decorator chain on handlers)
- **ASP.NET Core middleware pipeline** — each middleware decorates the next`,
    tags: ["decorator", "composition", "design-patterns", "solid", "scrutor"],
  },
  {
    id: 38,
    category: "Design Patterns",
    difficulty: "Hard",
    question: "Explain the Specification pattern. How does it encapsulate business rules and compose with EF Core?",
    answer: `**Specification** encapsulates a business rule (a predicate over a domain object) in a reusable, **composable, named object**. It answers "does this candidate satisfy this rule?" and lets you combine rules with And/Or/Not — turning scattered boolean conditions and query filters into first-class domain concepts.

### Core abstraction
\`\`\`csharp
public abstract class Specification<T> {
    public abstract Expression<Func<T, bool>> ToExpression();

    public bool IsSatisfiedBy(T candidate) => ToExpression().Compile()(candidate);

    public Specification<T> And(Specification<T> other) => new AndSpecification<T>(this, other);
    public Specification<T> Or(Specification<T> other)  => new OrSpecification<T>(this, other);
    public Specification<T> Not()                        => new NotSpecification<T>(this);
}
\`\`\`

### Named, reusable rules
\`\`\`csharp
public sealed class ActiveCustomerSpec : Specification<Customer> {
    public override Expression<Func<Customer, bool>> ToExpression() => c => c.IsActive;
}
public sealed class PremiumTierSpec : Specification<Customer> {
    public override Expression<Func<Customer, bool>> ToExpression() => c => c.Tier == Tier.Premium;
}
public sealed class InRegionSpec : Specification<Customer> {
    private readonly string _region;
    public InRegionSpec(string region) => _region = region;
    public override Expression<Func<Customer, bool>> ToExpression() => c => c.Region == _region;
}
\`\`\`

### Composition
\`\`\`csharp
var euPremiumActive = new ActiveCustomerSpec()
    .And(new PremiumTierSpec())
    .And(new InRegionSpec("EU"));

// In-memory validation (domain layer)
bool valid = euPremiumActive.IsSatisfiedBy(customer);

// EF Core query — translated to SQL
var customers = await _db.Customers
    .Where(euPremiumActive.ToExpression())
    .ToListAsync();
\`\`\`

### Making composites translate to SQL
Naive lambda composition (\`x => left(x) && right(x)\`) invokes expression trees EF Core can't translate. You must **rebind parameters** into a single shared parameter:
\`\`\`csharp
public sealed class AndSpecification<T> : Specification<T> {
    private readonly Specification<T> _l, _r;
    public AndSpecification(Specification<T> l, Specification<T> r) => (_l, _r) = (l, r);

    public override Expression<Func<T, bool>> ToExpression() {
        var left  = _l.ToExpression();
        var right = _r.ToExpression();
        var param = Expression.Parameter(typeof(T));
        var body  = Expression.AndAlso(
            new ReplaceParamVisitor(left.Parameters[0],  param).Visit(left.Body)!,
            new ReplaceParamVisitor(right.Parameters[0], param).Visit(right.Body)!);
        return Expression.Lambda<Func<T, bool>>(body, param);
    }
}

internal sealed class ReplaceParamVisitor(ParameterExpression from, ParameterExpression to) : ExpressionVisitor {
    protected override Expression VisitParameter(ParameterExpression node) => node == from ? to : base.VisitParameter(node);
}
\`\`\`
> In practice use **Ardalis.Specification** or **LinqKit** to avoid hand-rolling this plumbing.

### Repository integration (query-object variant)
\`\`\`csharp
// Thin repository — no method explosion
public interface ICustomerRepository {
    Task<IReadOnlyList<Customer>> ListAsync(Specification<Customer> spec);
    Task<Customer?> SingleOrDefaultAsync(Specification<Customer> spec);
}
\`\`\`
New queries are new \`Specification\` subclasses — the repository interface never changes (OCP win).

### Trade-offs
- **Pro:** single source of truth for a rule; testable in isolation; thin repositories; ubiquitous language alignment.
- **Con:** expression-tree plumbing is tricky — use a library; overkill for simple apps; in-memory vs SQL semantics can diverge (string collation, null handling).`,
    tags: ["specification", "design-patterns", "ef-core", "expression-trees", "ddd"],
  },

  // ── LLD (Low-Level Design) ───────────────────────────────────────────────
  {
    id: 39,
    category: "LLD (Low-Level Design)",
    difficulty: "Hard",
    question: "Design a Parking Lot system in C#. Walk through the object model, relationships, and key design decisions.",
    answer: `A Parking Lot LLD tests your ability to translate a real-world domain into a clean class hierarchy with correct relationships and encapsulation.

### Requirements (scope the problem first)
- Multiple levels, each with slots of different types (Compact, Regular, Large, Motorcycle).
- Vehicles: Motorcycle, Car, Truck — each fits only certain slot sizes.
- On entry: find and assign nearest available slot; issue a Ticket.
- On exit: calculate fee based on duration; free the slot.
- Payment strategies: Hourly, Daily flat rate.

### Object model
\`\`\`csharp
// Value objects
public enum SlotType   { Motorcycle, Compact, Regular, Large }
public enum VehicleType { Motorcycle, Car, Truck }

// Entity: individual parking slot
public class ParkingSlot {
    public Guid   Id       { get; }
    public SlotType Type   { get; }
    public int    Level    { get; }
    public int    Number   { get; }
    public bool   IsOccupied { get; private set; }

    public bool CanFit(VehicleType v) => (v, Type) switch {
        (VehicleType.Motorcycle, SlotType.Motorcycle) => true,
        (VehicleType.Car, SlotType.Compact or SlotType.Regular) => true,
        (VehicleType.Truck, SlotType.Large) => true,
        _ => false
    };

    public void Occupy()  => IsOccupied = true;
    public void Vacate()  => IsOccupied = false;
}

// Entity: Ticket — created on entry, closed on exit
public class Ticket {
    public Guid        Id          { get; } = Guid.NewGuid();
    public string      LicensePlate { get; }
    public VehicleType VehicleType  { get; }
    public ParkingSlot Slot         { get; }
    public DateTime    EntryTime    { get; } = DateTime.UtcNow;
    public DateTime?   ExitTime     { get; private set; }

    public Ticket(string plate, VehicleType type, ParkingSlot slot) {
        LicensePlate = plate; VehicleType = type; Slot = slot;
        slot.Occupy();
    }

    public TimeSpan Duration => (ExitTime ?? DateTime.UtcNow) - EntryTime;
    public void Close() { ExitTime = DateTime.UtcNow; Slot.Vacate(); }
}

// Strategy: pluggable fee calculation
public interface IFeeStrategy {
    decimal Calculate(Ticket ticket);
}
public class HourlyFeeStrategy : IFeeStrategy {
    private readonly decimal _ratePerHour;
    public HourlyFeeStrategy(decimal rate) => _ratePerHour = rate;
    public decimal Calculate(Ticket t) => (decimal)Math.Ceiling(t.Duration.TotalHours) * _ratePerHour;
}

// Aggregate root: ParkingLot
public class ParkingLot {
    private readonly List<ParkingSlot> _slots;
    private readonly Dictionary<Guid, Ticket> _activeTickets = new();
    private readonly IFeeStrategy _feeStrategy;

    public ParkingLot(IEnumerable<ParkingSlot> slots, IFeeStrategy strategy) {
        _slots = slots.ToList();
        _feeStrategy = strategy;
    }

    public Ticket Enter(string licensePlate, VehicleType vehicleType) {
        var slot = _slots.FirstOrDefault(s => !s.IsOccupied && s.CanFit(vehicleType))
            ?? throw new ParkingLotFullException(vehicleType);
        var ticket = new Ticket(licensePlate, vehicleType, slot);
        _activeTickets[ticket.Id] = ticket;
        return ticket;
    }

    public decimal Exit(Guid ticketId) {
        if (!_activeTickets.Remove(ticketId, out var ticket))
            throw new KeyNotFoundException("Ticket not found");
        ticket.Close();
        return _feeStrategy.Calculate(ticket);
    }

    public int AvailableSlots(VehicleType type) =>
        _slots.Count(s => !s.IsOccupied && s.CanFit(type));
}
\`\`\`

### Key design decisions
1. **Slot–Vehicle compatibility via \`CanFit\`** — avoids conditional logic scattered across callers.
2. **Ticket owns the slot reference** — simplifies exit; no external lookup needed.
3. **Strategy pattern for fees** — swap pricing models without touching \`ParkingLot\`.
4. **ParkingLot as aggregate root** — controls invariants (double-booking impossible).
5. **No static singletons** — DI-friendly; easier to test multiple lots.

### Extension points
- Add \`ISlotSelectionStrategy\` (nearest, by level, EV-first) without changing \`ParkingLot\`.
- Add \`ITicketRepository\` to persist tickets across restarts.
- Add concurrency control (\`SemaphoreSlim\` or optimistic locking) for multi-threaded entry gates.`,
    tags: ["lld", "object-design", "strategy-pattern", "oop", "parking-lot"],
  },
  {
    id: 40,
    category: "LLD (Low-Level Design)",
    difficulty: "Hard",
    question: "Design a thread-safe in-memory cache with TTL eviction in C#. Discuss concurrency trade-offs.",
    answer: `Designing a cache tests knowledge of concurrent data structures, TTL eviction strategies, and the trade-offs between correctness, performance, and complexity.

### Requirements
- Generic key-value cache with per-entry TTL.
- Thread-safe get/set/delete.
- Expired entries evicted lazily (on access) and eagerly (background sweep).
- Bounded capacity with LRU eviction.

### Implementation
\`\`\`csharp
public sealed class MemoryCache<TKey, TValue> : IDisposable where TKey : notnull {
    private sealed record Entry(TValue Value, DateTime ExpiresAt);

    // ConcurrentDictionary for lock-free reads on the hot path
    private readonly ConcurrentDictionary<TKey, Entry> _store = new();
    // Doubly-linked list for LRU ordering — protected by _lruLock
    private readonly LinkedList<TKey> _lruList = new();
    private readonly Dictionary<TKey, LinkedListNode<TKey>> _lruIndex = new();
    private readonly object _lruLock = new();
    private readonly int _capacity;
    private readonly Timer _sweepTimer;

    public MemoryCache(int capacity = 1000, TimeSpan? sweepInterval = null) {
        _capacity = capacity;
        _sweepTimer = new Timer(Sweep, null,
            sweepInterval ?? TimeSpan.FromMinutes(1),
            sweepInterval ?? TimeSpan.FromMinutes(1));
    }

    public bool TryGet(TKey key, out TValue? value) {
        if (_store.TryGetValue(key, out var entry) && entry.ExpiresAt > DateTime.UtcNow) {
            TouchLru(key);
            value = entry.Value;
            return true;
        }
        // Lazy eviction of expired entry
        if (entry is not null) Remove(key);
        value = default;
        return false;
    }

    public void Set(TKey key, TValue value, TimeSpan ttl) {
        _store[key] = new Entry(value, DateTime.UtcNow + ttl);
        lock (_lruLock) {
            if (_lruIndex.TryGetValue(key, out var node)) {
                _lruList.Remove(node);
            } else if (_store.Count > _capacity) {
                EvictLru();
            }
            _lruIndex[key] = _lruList.AddFirst(key);
        }
    }

    public void Remove(TKey key) {
        _store.TryRemove(key, out _);
        lock (_lruLock) {
            if (_lruIndex.Remove(key, out var node)) _lruList.Remove(node);
        }
    }

    private void TouchLru(TKey key) {
        lock (_lruLock) {
            if (_lruIndex.TryGetValue(key, out var node)) {
                _lruList.Remove(node);
                _lruIndex[key] = _lruList.AddFirst(key);
            }
        }
    }

    private void EvictLru() { // call under _lruLock
        var lru = _lruList.Last;
        if (lru is null) return;
        _lruList.RemoveLast();
        _lruIndex.Remove(lru.Value);
        _store.TryRemove(lru.Value, out _);
    }

    private void Sweep(object? _) {
        var now = DateTime.UtcNow;
        foreach (var (key, entry) in _store)
            if (entry.ExpiresAt <= now) Remove(key);
    }

    public void Dispose() => _sweepTimer.Dispose();
}
\`\`\`

### Concurrency trade-offs
| Decision | Trade-off |
|---|---|
| \`ConcurrentDictionary\` for store | Lock-free reads; better throughput than \`lock\` on whole dict |
| Separate \`_lruLock\` for LRU list | \`LinkedList\` isn't thread-safe; coarse lock acceptable since LRU touches are infrequent vs reads |
| Lazy + eager eviction | Lazy removes stale entries cheaply on read; background sweep handles entries nobody reads |
| \`Timer\` for sweep | Simple; doesn't block callers; acceptable jitter on TTL |

### Production considerations
- Use \`IMemoryCache\` (Microsoft.Extensions.Caching.Memory) or **StackExchange.Redis** for distributed caching rather than rolling your own in production.
- For high-read workloads, consider \`ReaderWriterLockSlim\` or partition the cache by hash bucket to reduce LRU lock contention.
- TTL should be measured from *last access* (sliding) or *creation* (absolute) — different semantics, different implementations.`,
    tags: ["lld", "cache", "concurrency", "concurrent-dictionary", "ttl"],
  },
  {
    id: 41,
    category: "LLD (Low-Level Design)",
    difficulty: "Hard",
    question: "Design a URL Shortener service class in C#. Cover collision handling, encoding, and extensibility.",
    answer: `A URL shortener maps a long URL to a short code. This tests encoding strategies, collision avoidance, storage abstraction, and rate-limiting hooks.

### Core design
\`\`\`csharp
// Domain model
public sealed record ShortLink(string Code, string OriginalUrl, DateTime ExpiresAt, int Hits);

// Repository abstraction (DIP)
public interface IShortLinkRepository {
    Task<string?> GetOriginalUrlAsync(string code);
    Task<bool> CodeExistsAsync(string code);
    Task SaveAsync(ShortLink link);
    Task IncrementHitsAsync(string code);
}

// Encoding: base62 over a random 8-byte token
public static class Base62Encoder {
    private const string Alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    public static string Encode(long number) {
        var sb = new StringBuilder();
        while (number > 0) {
            sb.Insert(0, Alphabet[(int)(number % 62)]);
            number /= 62;
        }
        return sb.Length < 7 ? sb.ToString().PadLeft(7, '0') : sb.ToString();
    }
}

public sealed class UrlShortenerService {
    private readonly IShortLinkRepository _repo;
    private readonly IOptions<ShortenerOptions> _opts;

    public UrlShortenerService(IShortLinkRepository repo, IOptions<ShortenerOptions> opts)
        => (_repo, _opts) = (repo, opts);

    public async Task<ShortLink> ShortenAsync(string originalUrl, TimeSpan? ttl = null) {
        if (!Uri.IsWellFormedUriString(originalUrl, UriKind.Absolute))
            throw new ArgumentException("Invalid URL", nameof(originalUrl));

        string code;
        int attempts = 0;
        const int MaxAttempts = 5;

        // Retry loop for collision avoidance
        do {
            if (++attempts > MaxAttempts) throw new InvalidOperationException("Cannot generate unique code");
            // Combine timestamp + random for low collision probability
            long seed = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() ^ Random.Shared.NextInt64();
            code = Base62Encoder.Encode(Math.Abs(seed));
        } while (await _repo.CodeExistsAsync(code));

        var link = new ShortLink(
            code,
            originalUrl,
            DateTime.UtcNow + (ttl ?? _opts.Value.DefaultTtl),
            Hits: 0);

        await _repo.SaveAsync(link);
        return link;
    }

    public async Task<string> ResolveAsync(string code) {
        var url = await _repo.GetOriginalUrlAsync(code)
            ?? throw new KeyNotFoundException($"Code '{code}' not found or expired");
        await _repo.IncrementHitsAsync(code);
        return url;
    }
}

public sealed class ShortenerOptions {
    public TimeSpan DefaultTtl { get; set; } = TimeSpan.FromDays(365);
}
\`\`\`

### Design decisions

| Decision | Rationale |
|---|---|
| Base62 over random \`long\` | URL-safe, compact (7 chars = 62⁷ ≈ 3.5T codes) |
| Collision retry loop | Probability of collision is negligible but guaranteed correct |
| Repository abstraction | Swap Redis, SQL, or in-memory store without touching service |
| TTL on every link | Prevent unbounded storage growth; configurable default |
| \`IncrementHitsAsync\` separate | Avoid read-modify-write race; use atomic DB increment |

### Scaling considerations (lead into HLD)
- **Hash approach**: MD5/SHA-256 the original URL → take first N chars → deterministic, no retry needed, but hash collisions map different URLs to same code.
- **ID-based**: auto-increment DB ID → base62-encode; guaranteed unique, but exposes insertion count.
- **Distributed counters**: use Redis \`INCR\` for globally unique IDs across instances without a single DB bottleneck.`,
    tags: ["lld", "url-shortener", "base62", "design", "oop"],
  },
  {
    id: 42,
    category: "LLD (Low-Level Design)",
    difficulty: "Hard",
    question: "When should you favour composition over inheritance? Give concrete C# examples of where inheritance breaks down.",
    answer: `**Composition over inheritance** (GoF principle): build complex behaviour by combining simple objects rather than building deep class hierarchies.

### Where inheritance breaks down

**1. The fragile base class problem**
\`\`\`csharp
// Base class
public class Collection<T> {
    protected int _count;
    public virtual void Add(T item) { InternalAdd(item); _count++; }
    public virtual void AddRange(IEnumerable<T> items) {
        foreach (var i in items) Add(i); // calls virtual Add
    }
}

// Subclass overrides Add — doesn't know base AddRange calls it
public class CountingCollection<T> : Collection<T> {
    private int _addCallCount;
    public override void Add(T item) { _addCallCount++; base.Add(item); }
    // Bug: AddRange(10 items) → _addCallCount = 10 but what about base double-counting?
}
\`\`\`
The subclass breaks when the base class changes its internal wiring — a violation of encapsulation.

**2. Violated Liskov Substitution**
\`\`\`csharp
// Classic: Square extends Rectangle — intuitive but broken
public class Rectangle { public virtual int Width { get; set; } public virtual int Height { get; set; } }
public class Square : Rectangle {
    public override int Width  { set { base.Width = base.Height = value; } }
    public override int Height { set { base.Width = base.Height = value; } }
}
// Code expecting a Rectangle breaks when handed a Square:
void SetDimensions(Rectangle r) { r.Width = 4; r.Height = 5; } // Square ends up 5×5, not 4×5
\`\`\`

**3. Rigid hierarchy for cross-cutting concerns**
\`\`\`csharp
// ❌ Can't add Logging AND Caching via inheritance without N×M subclasses
class BaseService { }
class LoggingService : BaseService { }
class CachingService : BaseService { }
class LoggingCachingService : ??? { } // C# has no multiple inheritance
\`\`\`

### Composition solves these
\`\`\`csharp
// Capability interfaces
public interface ILogger    { void Log(string msg); }
public interface ICache<T>  { bool TryGet(string key, out T val); void Set(string key, T val); }

// Compose behaviour — no inheritance needed
public class OrderService {
    private readonly IOrderRepository _repo;
    private readonly ILogger          _logger;
    private readonly ICache<Order>    _cache;

    public OrderService(IOrderRepository repo, ILogger logger, ICache<Order> cache)
        => (_repo, _logger, _cache) = (repo, logger, cache);

    public async Task<Order?> GetAsync(Guid id) {
        if (_cache.TryGet(id.ToString(), out var cached)) return cached;
        _logger.Log($"Cache miss for {id}");
        var order = await _repo.GetAsync(id);
        if (order is not null) _cache.Set(id.ToString(), order);
        return order;
    }
}
\`\`\`
Mix and match any combination of logger/cache implementations at DI registration time.

### Rules of thumb
- Use **inheritance** when there is a genuine **is-a** relationship AND the subtype is fully substitutable (LSP holds).
- Use **composition** (has-a) when you want to reuse behaviour, share implementation, or combine capabilities.
- In C#: prefer \`sealed\` classes by default; open for inheritance only when explicitly designed for it (document the extension contract).
- Interfaces define *roles*; abstract classes define *partial implementations*. Choose accordingly.`,
    tags: ["composition", "inheritance", "lsp", "oop", "lld", "solid"],
  },

  // ── HLD (High-Level Design) ──────────────────────────────────────────────
  {
    id: 43,
    category: "HLD (High-Level Design)",
    difficulty: "Hard",
    question: "Explain the CAP theorem. How does it influence database and architecture choices in distributed systems?",
    answer: `**CAP theorem** (Brewer, 2000): A distributed data store can guarantee at most **two** of the following three properties simultaneously:

| Property | Definition |
|---|---|
| **C**onsistency | Every read receives the most recent write or an error |
| **A**vailability | Every request receives a (non-error) response — without guarantee it's the latest data |
| **P**artition tolerance | The system continues operating even if network partitions drop messages between nodes |

In practice, **partition tolerance is non-negotiable** in any distributed system (networks do fail). So the real choice is between **CP** and **AP** during a partition.

### CP systems (Consistency + Partition tolerance)
During a partition: return an error or block rather than return stale data.

**Examples:** Apache ZooKeeper, etcd, HBase, most SQL DBs with synchronous replication.

**Use when:** correctness is critical — banking, inventory, distributed locks, leader election.
\`\`\`
Client → Leader → Replica (sync write) → OK
                → Replica (unreachable) → BLOCK / ERROR  ← trade availability for consistency
\`\`\`

### AP systems (Availability + Partition tolerance)
During a partition: return the best available (possibly stale) data; reconcile conflicts later.

**Examples:** DynamoDB (default), Cassandra, CouchDB, DNS.

**Use when:** availability matters more than perfect consistency — shopping carts, social feeds, DNS TTLs, leaderboards.
\`\`\`
Client → Node A → OK (returns stale data)
Client → Node B → OK (returns different stale data)
→ Eventual convergence via gossip/merkle trees
\`\`\`

### PACELC refinement (nuance for senior engineers)
CAP only describes behaviour during a partition. **PACELC** extends it:
- Even with no partition (**E**lse), systems trade **L**atency vs **C**onsistency.
- DynamoDB: PA / EL (favours availability & low latency even when healthy)
- Aurora: PC / EC (consistent reads at the cost of slightly higher latency)

### Practical architecture implications
\`\`\`
E-Commerce cart (AP):         DynamoDB / Redis — accept temporary inconsistency; merge on checkout
Distributed lock (CP):        etcd / Redis with Redlock — must not give lock to two holders
Payment ledger (CP):          CockroachDB / Aurora with serialisable isolation
Global DNS (AP):              Propagation delay acceptable; availability essential
Inventory reservation (CP):   SQL with optimistic concurrency or pessimistic lock
\`\`\`

### .NET async design implication
When consuming an AP data store, design for **idempotent retries** and **eventual consistency** at the application layer:
\`\`\`csharp
// Command handler must be idempotent — message may be delivered twice
public async Task Handle(PlaceOrderCommand cmd, CancellationToken ct) {
    if (await _orders.ExistsAsync(cmd.IdempotencyKey, ct)) return; // already processed
    // ... process
}
\`\`\``,
    tags: ["cap-theorem", "distributed-systems", "consistency", "availability", "hld"],
  },
  {
    id: 44,
    category: "HLD (High-Level Design)",
    difficulty: "Hard",
    question: "Compare caching strategies: Cache-Aside, Write-Through, Write-Behind, and Read-Through. When do you use each?",
    answer: `Choosing the right caching strategy is one of the most impactful HLD decisions. The wrong choice leads to stale data, cache stampedes, or write-amplification.

### Cache-Aside (Lazy Loading)
The application manages the cache explicitly.
\`\`\`
Read:  check cache → miss → load from DB → populate cache → return
Write: write to DB → invalidate (or update) cache
\`\`\`
\`\`\`csharp
public async Task<Product?> GetProductAsync(Guid id) {
    var key = $"product:{id}";
    var cached = await _redis.GetAsync<Product>(key);
    if (cached is not null) return cached;
    var product = await _db.Products.FindAsync(id);
    if (product is not null) await _redis.SetAsync(key, product, TimeSpan.FromMinutes(10));
    return product;
}
\`\`\`
**Pros:** cache only what's actually used; resilient (cache failure degrades to DB, not outage).
**Cons:** cache miss penalty (extra latency on first load); risk of stale data between write and invalidation; **thundering herd** on cold start.

### Write-Through
Every write goes to cache AND database synchronously.
\`\`\`
Write: write to cache → write to DB (or DB first, then cache) → return
Read:  cache hit (always fresh if cache stays warm)
\`\`\`
**Pros:** cache always consistent with DB; reads always hit cache after first write.
**Cons:** write latency doubles (two round trips); cache may hold data that's never read ("write penalty for rare reads").

### Write-Behind (Write-Back)
Writes go to the cache first; asynchronously flushed to the DB.
\`\`\`
Write: write to cache → return immediately → background flush to DB
\`\`\`
**Pros:** lowest write latency; absorbs write bursts (counters, metrics, leaderboards).
**Cons:** data loss if cache crashes before flush; complex conflict resolution; not suitable for financial or audit data.

### Read-Through
Cache sits in front of DB; on a miss the cache itself loads from DB.
\`\`\`
Application → Cache → (miss) Cache loads from DB → returns to application
\`\`\`
**Pros:** application code stays simple — no explicit DB fallback logic.
**Cons:** first-request latency on cold cache; tightly couples cache layer to DB access patterns.

### Decision matrix

| Strategy | Read latency | Write latency | Consistency | Complexity | Use case |
|---|---|---|---|---|---|
| Cache-Aside | Miss penalty | Low | Eventual | Medium | Most read-heavy APIs |
| Write-Through | Low | High | Strong | Medium | Profile/user data |
| Write-Behind | Low | Very low | Eventual | High | Counters, analytics, leaderboards |
| Read-Through | Low after warm | Varies | Eventual | Low | Libraries like NHibernate L2 cache |

### Advanced: Cache stampede prevention
\`\`\`csharp
// Probabilistic early expiry (XFetch algorithm)
double shouldRefresh = -_delta * _beta * Math.Log(Random.Shared.NextDouble());
if (remainingTtl <= shouldRefresh) {
    // Start background refresh before expiry to avoid a thundering herd
}
\`\`\`
Or use a **mutex/semaphore** per key so only one request fetches; others wait.`,
    tags: ["caching", "cache-aside", "write-through", "redis", "hld"],
  },
  {
    id: 45,
    category: "HLD (High-Level Design)",
    difficulty: "Hard",
    question: "Explain database sharding strategies. What are the trade-offs between range, hash, and directory sharding?",
    answer: `**Sharding** horizontally partitions data across multiple database nodes so no single node holds the full dataset, enabling horizontal scaling of both storage and throughput.

### Why shard?
- Single-node write throughput ceiling reached.
- Dataset too large for one server's disk/RAM.
- Geographic data locality requirements.

### Range sharding
Partitions data by a contiguous range of the shard key (e.g., userId 1–1M → shard A, 1M–2M → shard B).
\`\`\`
Shard A: orders 1 – 1,000,000
Shard B: orders 1,000,001 – 2,000,000
Shard C: orders 2,000,001 – ...
\`\`\`
**Pros:** range queries are efficient (scan contiguous shards); easy to add new shards at the high end.
**Cons:** **hotspot** problem — recent data (high IDs) all hits the newest shard; uneven load distribution.

### Hash sharding
\`shardIndex = hash(shardKey) % numberOfShards\`
\`\`\`
order.Id = "abc123" → hash → shard 2
order.Id = "def456" → hash → shard 0
\`\`\`
**Pros:** even distribution; no hotspots for uniform-access patterns.
**Cons:** range queries require scatter-gather across all shards; **resharding** when adding nodes is expensive (consistent hashing mitigates this).

### Consistent hashing (solves resharding)
Place shards on a virtual ring; each key maps to the nearest shard clockwise. Adding a node only remaps ~1/N of keys.
Used by: Cassandra, DynamoDB, Redis Cluster.

### Directory sharding (lookup table)
A separate mapping service/table stores key → shard assignment.
\`\`\`
Lookup: tenantId = "acme" → shard 7
\`\`\`
**Pros:** maximum flexibility; move tenants between shards without rehashing; supports non-uniform shard sizes.
**Cons:** lookup service is a **single point of failure**; adds latency; operational complexity.

### Cross-shard challenges
\`\`\`
# These operations become expensive or impossible with sharding:
- JOINs across shard boundaries → must scatter-gather or denormalise
- Distributed transactions (2PC) → performance and availability cost
- Global ORDER BY / GROUP BY → merge results in application layer
- Unique constraints across shards → require coordination (UUID vs sequential ID)
\`\`\`

### Practical .NET / Azure guidance
- **Azure SQL Elastic Pools**: managed range/hash sharding for multi-tenant apps.
- **Cosmos DB**: native hash-based partitioning; choose partition key carefully (avoid cross-partition queries).
- **EF Core Sharding**: libraries like \`ShardingCore\` add shard-routing middleware.

### Shard key selection rules
1. High cardinality — enough values to spread load.
2. Even distribution — avoid a single "whale" tenant dominating a shard.
3. Locality — operations that go together should target the same shard.
4. Immutability — changing a shard key means moving the row; avoid mutable keys.`,
    tags: ["sharding", "database-scaling", "consistent-hashing", "hld", "distributed-systems"],
  },
  {
    id: 46,
    category: "HLD (High-Level Design)",
    difficulty: "Hard",
    question: "Explain message queues and event streaming. When do you choose Kafka over RabbitMQ?",
    answer: `Both message queues and event streams decouple producers from consumers, but they have fundamentally different models.

### Message Queue (RabbitMQ, Azure Service Bus, SQS)
\`\`\`
Producer → Queue → Consumer (message deleted after ACK)
\`\`\`
- **Once delivery**: message consumed by one consumer; removed from queue on ACK.
- **Push model**: broker pushes to available consumers.
- **Routing**: exchange/binding rules, topic routing, dead-letter queues.
- **Retention**: ephemeral — consumed messages are gone.

### Event Stream (Kafka, Azure Event Hubs)
\`\`\`
Producer → Topic (partitions) → Consumer Group A (reads offset 0..N)
                              → Consumer Group B (reads offset 0..N independently)
\`\`\`
- **Log-based**: events are persisted for a configurable retention period (days/weeks/forever).
- **Pull model**: consumers read at their own pace; offset is consumer-owned.
- **Replay**: rewind to any offset; replay events for a new service or after a bug fix.
- **Multiple independent consumers**: each consumer group reads the full stream independently.

### Decision matrix

| Criteria | RabbitMQ / Service Bus | Kafka / Event Hubs |
|---|---|---|
| Work distribution (task queues) | ✅ Native | Possible via partitions |
| Multiple independent consumers | Complex (fan-out exchange) | ✅ Consumer groups |
| Event replay / audit log | ❌ Messages deleted | ✅ Retention-based replay |
| Ordering guarantee | Per-queue | Per-partition |
| Throughput | 10k–100k msg/s | Millions msg/s |
| Operational complexity | Low–Medium | High (ZooKeeper/KRaft) |
| Message TTL / routing logic | ✅ Rich | Limited |
| Event sourcing / CQRS read model rebuild | ❌ | ✅ |

### .NET integration patterns
\`\`\`csharp
// MassTransit (works with both RabbitMQ and Azure Service Bus)
builder.Services.AddMassTransit(x => {
    x.AddConsumer<OrderPlacedConsumer>();
    x.UsingRabbitMq((ctx, cfg) => {
        cfg.ReceiveEndpoint("order-placed", e => e.ConfigureConsumer<OrderPlacedConsumer>(ctx));
    });
});

// Confluent.Kafka for event streaming
var config = new ConsumerConfig { GroupId = "report-service", AutoOffsetReset = AutoOffsetReset.Earliest };
using var consumer = new ConsumerBuilder<string, string>(config).Build();
consumer.Subscribe("orders");
while (true) {
    var msg = consumer.Consume();
    await ProcessAsync(msg.Value);
    consumer.Commit(msg); // explicit offset commit
}
\`\`\`

### Hybrid architecture
Many systems use both: Kafka for high-volume event streams and audit logs; RabbitMQ/Service Bus for task queues that need routing, DLQ, and transactional messaging.`,
    tags: ["message-queue", "kafka", "rabbitmq", "event-streaming", "hld"],
  },

  // ── System Design ────────────────────────────────────────────────────────
  {
    id: 47,
    category: "System Design",
    difficulty: "Hard",
    question: "Design a rate limiter for an API gateway. Walk through multiple algorithms and their trade-offs.",
    answer: `A rate limiter protects upstream services from abuse, controls costs, and enforces fair usage. Senior engineers are expected to know multiple algorithms and their characteristics.

### Algorithms

**1. Token Bucket**
A bucket holds up to \`capacity\` tokens. Tokens refill at rate \`r/second\`. Each request consumes one token; reject if empty.
\`\`\`csharp
public class TokenBucketRateLimiter {
    private readonly double _refillRate;  // tokens/second
    private readonly double _capacity;
    private double _tokens;
    private DateTime _lastRefill = DateTime.UtcNow;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public async Task<bool> AllowAsync() {
        await _lock.WaitAsync();
        try {
            var now = DateTime.UtcNow;
            var elapsed = (now - _lastRefill).TotalSeconds;
            _tokens = Math.Min(_capacity, _tokens + elapsed * _refillRate);
            _lastRefill = now;
            if (_tokens < 1) return false;
            _tokens--;
            return true;
        } finally { _lock.Release(); }
    }
}
\`\`\`
**Pros:** allows bursts up to \`capacity\`; smooth average rate. **Cons:** tricky to implement correctly in distributed systems.

**2. Leaky Bucket**
Requests enter a queue (bucket); processed at a fixed drain rate. Overflow is rejected.
**Pros:** smooths bursty traffic; output rate is constant. **Cons:** delays legitimate requests; queue management overhead.

**3. Fixed Window Counter**
Count requests per fixed window (e.g., 1-minute epoch). Reset at window boundary.
\`\`\`
Redis: INCR user:123:2024010112  EXPIRE user:123:2024010112 60
\`\`\`
**Pros:** simple, cheap. **Cons:** boundary burst — 200 req in last second of window + 200 in first second of next = 400 in 2 seconds, violating intent.

**4. Sliding Window Log**
Store timestamp of each request. Count those within the last \`windowSize\`. Reject if count ≥ limit.
**Pros:** accurate. **Cons:** memory-intensive (store per-request timestamp at scale).

**5. Sliding Window Counter (best practical choice)**
Blend of fixed window + sliding: \`count = current_window_count + previous_window_count × (1 - elapsed_fraction)\`
\`\`\`csharp
double rate = prevCount * (1.0 - elapsedFraction) + currCount;
if (rate >= limit) return false;
\`\`\`
**Pros:** O(1) memory; approximates sliding window; handles boundary burst. Standard in production (Cloudflare, Redis rate limiting).

### Distributed implementation with Redis
\`\`\`
MULTI
  INCR  rl:{userId}:{windowKey}
  EXPIRE rl:{userId}:{windowKey} {windowSeconds}
EXEC
\`\`\`
For atomic sliding window, use a Lua script to execute the blend formula atomically.

### API gateway design
\`\`\`
Request → Load Balancer → API Gateway (rate limit check via Redis)
                              → 429 Too Many Requests (with Retry-After header)
                              → Upstream Service
\`\`\`
Key headers to return: \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`, \`Retry-After\`.

### .NET: ASP.NET Core built-in (NET 7+)
\`\`\`csharp
builder.Services.AddRateLimiter(opts => {
    opts.AddSlidingWindowLimiter("api", o => {
        o.Window = TimeSpan.FromMinutes(1);
        o.SegmentsPerWindow = 6;
        o.PermitLimit = 100;
        o.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });
});
app.UseRateLimiter();
\`\`\``,
    tags: ["rate-limiter", "token-bucket", "redis", "api-gateway", "system-design"],
  },
  {
    id: 48,
    category: "System Design",
    difficulty: "Hard",
    question: "What is CQRS and Event Sourcing? How do they complement each other and what are the real costs?",
    answer: `**CQRS** (Command Query Responsibility Segregation) separates the write model (commands that mutate state) from the read model (queries that return data). **Event Sourcing** stores all state changes as an immutable log of domain events rather than the current state.

### CQRS alone
\`\`\`
Write side:  Command → CommandHandler → Domain Aggregate → persisted state
Read side:   Query  → ReadModel (denormalised, optimised projection) → Response
\`\`\`
\`\`\`csharp
// Write side — rich domain model
public class Order { /* business logic, invariants, encapsulation */ }
public class PlaceOrderHandler : IRequestHandler<PlaceOrderCommand, OrderId> { ... }

// Read side — flat, query-optimised DTO
public class OrderSummaryDto { public Guid Id; public string Status; public decimal Total; }
public class GetOrderSummaryHandler : IRequestHandler<GetOrderSummaryQuery, OrderSummaryDto> {
    // hits a separate read store: denormalised SQL view, Elasticsearch, or Redis
}
\`\`\`
**Benefits:** read and write stores can be scaled, optimised, and evolved independently.

### Event Sourcing
Instead of storing current state, store every event that happened:
\`\`\`csharp
// Events — immutable facts
public record OrderPlaced(Guid OrderId, Guid CustomerId, DateTime At);
public record ItemAdded(Guid OrderId, Guid ProductId, int Qty, decimal Price);
public record OrderShipped(Guid OrderId, string TrackingNumber, DateTime At);

// Aggregate rebuilds state by replaying events
public class Order {
    public Guid Id { get; private set; }
    public OrderStatus Status { get; private set; }
    private readonly List<object> _changes = new();

    public static Order Replay(IEnumerable<object> events) {
        var order = new Order();
        foreach (var e in events) order.Apply(e);
        return order;
    }

    private void Apply(object e) {
        switch (e) {
            case OrderPlaced p: Id = p.OrderId; Status = OrderStatus.Placed; break;
            case OrderShipped: Status = OrderStatus.Shipped; break;
        }
    }
}
\`\`\`

### CQRS + Event Sourcing together
\`\`\`
Command → Aggregate → emits Events → stored in Event Store (append-only)
                                   → published to message bus
                                         → Projection updates Read Model
                                         → Email notification handler
                                         → Analytics handler
\`\`\`

### Real benefits
- **Full audit log** — every state change recorded with who/when/why.
- **Temporal queries** — "what was the order state at 2pm yesterday?"
- **Event replay** — rebuild read models, add new projections, recover from bugs.
- **Natural event-driven integration** — events are the API to downstream services.

### Real costs (often understated)
| Cost | Detail |
|---|---|
| **Eventual consistency** | Read models lag behind writes; UI must handle stale reads |
| **Schema evolution** | Events are forever; changing event shape requires upcasting/versioning strategy |
| **Snapshot management** | Long-lived aggregates (1000s of events) require periodic snapshots |
| **Operational complexity** | Event store, projection workers, replay pipelines — significant ops overhead |
| **Query complexity** | No SQL JOIN on current state; every query needs a purpose-built projection |

### When NOT to use it
CQRS + ES is overkill for CRUD-heavy apps with simple reporting needs. It pays off in complex domains with rich audit requirements, multiple integration consumers, and long-lived aggregates (banking, supply chain, insurance).`,
    tags: ["cqrs", "event-sourcing", "domain-events", "architecture", "system-design"],
  },
  {
    id: 49,
    category: "System Design",
    difficulty: "Hard",
    question: "Microservices vs monolith: how do you decide, and what does the migration path look like?",
    answer: `This is one of the most nuanced architectural decisions. The correct answer depends on team size, domain complexity, traffic, and organisational structure — not on hype.

### Monolith strengths (often underrated)
- **Simple deployment**: one artifact, one service.
- **Low latency**: in-process calls, not network hops.
- **ACID transactions**: single database; no distributed transaction complexity.
- **Easy debugging**: single process, single stack trace.
- **Fast iteration**: no service boundary friction; refactoring is cheap.
- **Right for most teams**: the majority of successful systems started as well-structured monoliths.

### When to move to microservices
Conway's Law: your architecture mirrors your communication structure. Microservices make sense when:
- **Independent scalability** is required (payments team needs 10× the capacity of reporting).
- **Independent deployability** is critical (100 engineers deploying 10× per day; one service blocking all deployments is unacceptable).
- **Technology heterogeneity** is justified (ML model service in Python; transaction service in .NET).
- **Fault isolation** is mandatory (a crash in recommendations must not take down checkout).
- **Domain boundaries are clear and stable** — microservices enforce boundaries that must exist.

### The Strangler Fig migration pattern
\`\`\`
1. Add a façade / API gateway in front of the monolith.
2. Extract one vertical slice at a time:
   - Identify a bounded context with a clear seam.
   - Create the new service with its own database.
   - Route traffic to the new service via the façade.
   - Delete the old code from the monolith.
3. Repeat until the monolith is gone (or acceptably small).
\`\`\`
\`\`\`
Request → Gateway → [old monolith: /api/products, /api/orders]
                  → [new service: /api/inventory (extracted)]
\`\`\`

### Costs of microservices (frequently underestimated)
| Cost | Details |
|---|---|
| **Distributed transactions** | 2PC is fragile; Saga pattern adds significant complexity |
| **Network latency & failures** | Calls can fail, time out, or return stale data; requires retries, circuit breakers |
| **Data consistency** | No foreign keys across services; eventual consistency by default |
| **Operational overhead** | Service discovery, health checks, distributed tracing, multiple CI/CD pipelines |
| **Testing complexity** | Contract testing (Pact), integration tests across services |
| **Observability** | Correlation IDs, distributed traces (OpenTelemetry) required from day 1 |

### Senior heuristics
- **Don't start with microservices.** Build a modular monolith first; extract services when you hit concrete scaling or team autonomy limits.
- **Module boundaries first.** If you can't draw clean boundaries inside a monolith, you won't be able to in microservices — you'll just have a distributed monolith.
- **Database per service is non-negotiable.** Shared databases between "services" are the single biggest indicator of a failed microservices migration.
- **Aim for 2-pizza team per service.** If one team owns 20 microservices, they're really a modular monolith with extra overhead.`,
    tags: ["microservices", "monolith", "architecture", "strangler-fig", "system-design"],
  },
  {
    id: 50,
    category: "System Design",
    difficulty: "Hard",
    question: "Design a distributed notification system (email, push, SMS). How do you handle reliability, ordering, and scale?",
    answer: `A notification system is a classic HLD interview problem that covers fan-out, reliability, deduplication, and multi-channel delivery.

### Requirements (scope first)
- Channels: email, push (APNs/FCM), SMS.
- Triggered by domain events (OrderPlaced, PasswordReset, PromoAlert).
- At-least-once delivery with deduplication.
- Delivery receipts and failure handling.
- Rate limiting per user (no spam).
- ~100M notifications/day.

### High-level architecture
\`\`\`
Domain Services
    │  publish events
    ▼
Message Bus (Kafka / Azure Service Bus)
    │
    ▼
Notification Service (fan-out orchestrator)
    │  creates per-channel jobs
    ▼
Channel Queues (separate queues per channel)
    ├── Email Queue   → Email Worker → SendGrid / SES
    ├── Push Queue    → Push Worker  → APNs / FCM
    └── SMS Queue     → SMS Worker   → Twilio / AWS SNS
                                          │
                                          ▼
                                   Delivery Receipt Store (Redis + DB)
\`\`\`

### Reliability: at-least-once + deduplication
\`\`\`csharp
// Idempotency key per notification
public record SendEmailJob(Guid IdempotencyKey, string To, string Template, object Data);

// Worker checks before processing
public async Task HandleAsync(SendEmailJob job) {
    if (await _dedup.HasBeenProcessedAsync(job.IdempotencyKey)) return;
    try {
        await _emailProvider.SendAsync(job.To, job.Template, job.Data);
        await _dedup.MarkProcessedAsync(job.IdempotencyKey, expiry: TimeSpan.FromDays(7));
    } catch (Exception ex) {
        _logger.LogError(ex, "Failed to send {Id}", job.IdempotencyKey);
        throw; // re-enqueue by messaging infrastructure
    }
}
\`\`\`

### Fan-out for broadcast notifications
\`\`\`
Promo campaign → 50M recipients
    ↓
DON'T query all users in a loop — use partition-based fan-out:
    ├── Fan-out Worker reads user IDs in batches of 10k
    ├── Writes to Channel Queue in bulk
    └── Multiple workers drain the queue in parallel
\`\`\`

### Rate limiting per user (prevent spam)
\`\`\`
Redis: INCR user:{id}:email:{hour} → if > 3, drop or defer to next window
\`\`\`

### Failure handling
- **DLQ (Dead Letter Queue)**: after N retries, move to DLQ for manual inspection / alerting.
- **Exponential backoff**: retry at 1s, 2s, 4s, 8s… up to 15 minutes.
- **Provider fallback**: primary email provider down → switch to backup provider automatically.

### Ordering guarantee
Notifications are typically **best-effort ordered** within a channel for a user. Use Kafka partition key = userId to guarantee per-user ordering when it matters (e.g., OTP codes must arrive in order).

### Key .NET implementation notes
- Use **MassTransit** or **Azure Service Bus** with sessions for ordered delivery.
- **Outbox pattern**: write notification jobs to a DB outbox table inside the same transaction as the domain event, then relay to the queue — guarantees exactly-once production.
- **OpenTelemetry**: trace notification lifecycle end-to-end with correlation ID from the originating event.`,
    tags: ["notification-system", "distributed-systems", "fan-out", "reliability", "system-design"],
  },
  {
    id: 51,
    category: "System Design",
    difficulty: "Hard",
    question: "Explain the Saga pattern for distributed transactions. Compare choreography vs orchestration.",
    answer: `When a business operation spans multiple services (create order, reserve inventory, charge payment), you can't use a single ACID transaction. The **Saga** pattern breaks the operation into a sequence of local transactions, each publishing events or messages. If any step fails, compensating transactions undo prior steps.

### Why not 2-Phase Commit (2PC)?
2PC provides distributed ACID but at severe cost: the coordinator is a SPOF; all participants block while waiting for phase-2; any participant crash can leave the system in-doubt indefinitely. 2PC is rarely used in microservice architectures at scale.

### Saga: Choreography
Services react to events; no central coordinator.
\`\`\`
OrderService → publishes OrderPlaced
    ↓
InventoryService → listens → reserves stock → publishes StockReserved
    ↓
PaymentService → listens → charges card → publishes PaymentCharged
    ↓
OrderService → listens → marks OrderConfirmed

// Failure path:
PaymentService → charge fails → publishes PaymentFailed
    ↓
InventoryService → listens → releases reservation → publishes StockReleased
    ↓
OrderService → listens → marks OrderFailed
\`\`\`
**Pros:** loose coupling; no SPOF; services are independently deployable.
**Cons:** hard to track overall saga state; difficult to debug; business logic scattered across services; circular event dependency risk.

### Saga: Orchestration
A central orchestrator (process manager) tells each service what to do and handles failures.
\`\`\`csharp
public class PlaceOrderSaga : MassTransitStateMachine<PlaceOrderSagaState> {
    public PlaceOrderSaga() {
        InstanceState(x => x.CurrentState);

        Event(() => OrderSubmitted, x => x.CorrelateById(ctx => ctx.Message.OrderId));
        Event(() => StockReserved,  x => x.CorrelateById(ctx => ctx.Message.OrderId));
        Event(() => PaymentCharged, x => x.CorrelateById(ctx => ctx.Message.OrderId));
        Event(() => PaymentFailed,  x => x.CorrelateById(ctx => ctx.Message.OrderId));

        Initially(When(OrderSubmitted)
            .Send(ctx => new ReserveStockCommand(ctx.Message.OrderId, ctx.Message.Items))
            .TransitionTo(ReservingStock));

        During(ReservingStock, When(StockReserved)
            .Send(ctx => new ChargePaymentCommand(ctx.Message.OrderId, ctx.Message.Amount))
            .TransitionTo(ChargingPayment));

        During(ChargingPayment, 
            When(PaymentCharged).TransitionTo(Completed),
            When(PaymentFailed)
                .Send(ctx => new ReleaseStockCommand(ctx.Message.OrderId))
                .TransitionTo(Failed));
    }
}
\`\`\`
**Pros:** clear business process visibility; centralised error handling; easier to monitor/debug; consistent saga state.
**Cons:** orchestrator can become a bottleneck or God Object; coupling between orchestrator and each service.

### Comparison

| | Choreography | Orchestration |
|---|---|---|
| Coupling | Loose (events) | Tighter (direct commands) |
| Visibility | Low (distributed) | High (state machine) |
| Debugging | Hard | Easier |
| Complexity | Grows with participants | Centralised complexity |
| Best for | Simple, stable flows | Complex, multi-step business processes |

### Key implementation concerns
- **Idempotency**: compensating transactions must be safe to replay.
- **Saga state persistence**: store state durably (DB) before publishing commands — never in memory.
- **Timeout/dead-letter handling**: a step that never responds needs a timeout → compensation.
- **.NET tools**: MassTransit Sagas (state machine), NServiceBus Sagas, Dapr Workflow.`,
    tags: ["saga-pattern", "distributed-transactions", "choreography", "orchestration", "microservices"],
  },
];
