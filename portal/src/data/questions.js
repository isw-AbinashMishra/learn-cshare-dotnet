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
];
