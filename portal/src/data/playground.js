export const playgroundCategories = [
  "Basics",
  "Control Flow",
  "Methods",
  "OOP",
  "Collections",
  "LINQ",
  "Async",
];

export const snippets = [
  // ── Basics ────────────────────────────────────────────────────────────────
  {
    id: 1,
    category: "Basics",
    title: "Hello World & Variables",
    summary: "Declaring variables, type inference with `var`, and string interpolation.",
    code: `// Top-level statements (C# 9+) — no class/Main boilerplate needed
using System;

// Explicit type declarations
string name = "C#";
int version = 12;
double pi = 3.14159;
bool isAwesome = true;

// Type inference — var deduces the type at compile time
var greeting = $"Hello from {name} {version}!";
Console.WriteLine(greeting);

// String interpolation
Console.WriteLine($"Pi ≈ {pi:F2}, isAwesome = {isAwesome}");

// Constants — value cannot change after assignment
const int MaxRetries = 3;
Console.WriteLine($"Max retries: {MaxRetries}");`,
    output: `Hello from C# 12!
Pi ≈ 3.14, isAwesome = True
Max retries: 3`,
    notes: [
      "`var` is still statically typed — the compiler infers the type. It is NOT dynamic.",
      "String interpolation `$\"...{expr}...\"` is compiled to `string.Format` calls.",
      "`const` fields are evaluated at compile time; `readonly` fields at runtime.",
    ],
  },
  {
    id: 2,
    category: "Basics",
    title: "Data Types & Conversions",
    summary: "Primitive types, nullable types, parsing, and safe casting.",
    code: `using System;

// Numeric types
int    i  = 2_147_483_647;   // int max (digit separators for readability)
long   l  = 9_223_372_036_854_775_807L;
float  f  = 3.14f;
double d  = 3.14159265358979;
decimal m = 19.99m;          // decimal for money — precise base-10

Console.WriteLine($"int max:     {i}");
Console.WriteLine($"long max:    {l}");
Console.WriteLine($"float:       {f}");
Console.WriteLine($"double:      {d}");
Console.WriteLine($"decimal:     {m}");

// Nullable value types
int? maybeNull = null;
Console.WriteLine($"Nullable:    {maybeNull ?? -1}");  // null-coalescing ??

// Parsing strings
int parsed  = int.Parse("42");
bool ok     = int.TryParse("abc", out int safe);  // safe — won't throw
Console.WriteLine($"Parsed: {parsed}, TryParse ok: {ok}, safe: {safe}");

// Explicit cast vs Convert
double x = 9.99;
int truncated  = (int)x;                  // truncates to 9
int rounded    = (int)Math.Round(x);      // rounds to 10
Console.WriteLine($"Truncated: {truncated}, Rounded: {rounded}");`,
    output: `int max:     2147483647
long max:    9223372036854775807
float:       3.14
double:      3.14159265358979
decimal:     19.99
Nullable:    -1
Parsed: 42, TryParse ok: False, safe: 0
Truncated: 9, Rounded: 10`,
    notes: [
      "Use `decimal` for financial/monetary calculations — `double` has floating-point rounding errors.",
      "`int.TryParse` is always preferred over `int.Parse` when input may be invalid.",
      "Digit separators (`_`) are purely cosmetic and ignored by the compiler.",
    ],
  },
  // ── Control Flow ───────────────────────────────────────────────────────────
  {
    id: 3,
    category: "Control Flow",
    title: "if / else / switch",
    summary: "Conditionals, switch expressions, and pattern matching basics.",
    code: `using System;

int score = 72;

// Classic if/else
string grade;
if      (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 70) grade = "C";
else if (score >= 60) grade = "D";
else                  grade = "F";
Console.WriteLine($"Grade: {grade}");

// Switch expression (C# 8+) — concise and exhaustive
string category = score switch
{
    >= 90 => "Excellent",
    >= 70 => "Good",
    >= 50 => "Pass",
    _     => "Fail",       // _ is the discard / default arm
};
Console.WriteLine($"Category: {category}");

// Pattern matching with 'is'
object obj = "Hello";
if (obj is string s && s.Length > 3)
    Console.WriteLine($"Long string: {s}");

// Type switch
static string Describe(object o) => o switch
{
    int n when n > 0  => $"Positive int: {n}",
    int n             => $"Non-positive int: {n}",
    string str        => $"String of length {str.Length}",
    null              => "null",
    _                 => "Something else",
};
Console.WriteLine(Describe(42));
Console.WriteLine(Describe(-5));
Console.WriteLine(Describe("C#"));`,
    output: `Grade: C
Category: Good
Long string: Hello
Positive int: 42
Non-positive int: -5
String of length 2`,
    notes: [
      "Switch expressions (C# 8+) are expressions (return a value), not statements.",
      "The `_` discard arm is the default; the compiler warns if not all cases are covered.",
      "Pattern matching (`is`, `switch` with patterns) reduces the need for explicit casting.",
    ],
  },
  {
    id: 4,
    category: "Control Flow",
    title: "Loops — for, while, foreach",
    summary: "All loop constructs including `break`, `continue`, and `do/while`.",
    code: `using System;
using System.Collections.Generic;

// for — index-based
for (int i = 0; i < 5; i++)
    Console.Write($"{i} ");
Console.WriteLine();

// while — condition-based
int count = 0;
while (count < 3)
{
    Console.Write($"w{count} ");
    count++;
}
Console.WriteLine();

// do/while — always executes at least once
int x = 0;
do
{
    Console.Write($"d{x} ");
    x++;
} while (x < 3);
Console.WriteLine();

// foreach — iterating collections
var fruits = new List<string> { "Apple", "Banana", "Cherry" };
foreach (string fruit in fruits)
    Console.Write($"{fruit} ");
Console.WriteLine();

// break and continue
for (int i = 0; i < 10; i++)
{
    if (i % 2 == 0) continue;   // skip even
    if (i > 7)      break;      // stop at 8
    Console.Write($"{i} ");
}
Console.WriteLine();`,
    output: `0 1 2 3 4 
w0 w1 w2 
d0 d1 d2 
Apple Banana Cherry 
1 3 5 7`,
    notes: [
      "Prefer `foreach` over `for` when you don't need the index — it works on any `IEnumerable<T>`.",
      "Avoid modifying a collection while iterating with `foreach` — it throws `InvalidOperationException`.",
      "`for` loops with index access are faster than `foreach` on arrays (compiler optimisation).",
    ],
  },
  // ── Methods ─────────────────────────────────────────────────────────────────
  {
    id: 5,
    category: "Methods",
    title: "Methods, Parameters & Return Values",
    summary: "Defining methods, optional parameters, `out`/`ref`, and expression-bodied members.",
    code: `using System;

// Basic method
static int Add(int a, int b) => a + b;     // expression-bodied (C# 6+)

// Optional parameters with defaults
static string Greet(string name, string salutation = "Hello") =>
    $"{salutation}, {name}!";

// Named arguments (any order)
Console.WriteLine(Greet(salutation: "Hi", name: "Ada"));

// out parameter — return multiple values
static bool TryDivide(int a, int b, out double result)
{
    if (b == 0) { result = 0; return false; }
    result = (double)a / b;
    return true;
}

if (TryDivide(10, 3, out double ratio))
    Console.WriteLine($"10 / 3 = {ratio:F3}");

// ref — pass by reference (mutates the original)
static void Double(ref int value) => value *= 2;
int num = 7;
Double(ref num);
Console.WriteLine($"Doubled: {num}");   // 14

// params — variable argument count
static int Sum(params int[] numbers)
{
    int total = 0;
    foreach (int n in numbers) total += n;
    return total;
}
Console.WriteLine($"Sum: {Sum(1, 2, 3, 4, 5)}");   // 15

Console.WriteLine(Add(3, 4));
Console.WriteLine(Greet("World"));`,
    output: `Hi, Ada!
10 / 3 = 3.333
Doubled: 14
Sum: 15
7
Hello, World!`,
    notes: [
      "`out` variables can be declared inline since C# 7: `TryDivide(a, b, out double r)`.",
      "Prefer `out` over `ref` when you only need to return additional values from a method.",
      "`params` must be the last parameter and there can be only one per method.",
    ],
  },
  // ── OOP ─────────────────────────────────────────────────────────────────────
  {
    id: 6,
    category: "OOP",
    title: "Classes, Properties & Constructors",
    summary: "Defining classes with auto-properties, constructors, and object initializers.",
    code: `using System;

public class Animal
{
    // Auto-implemented properties
    public string Name  { get; set; }
    public string Sound { get; init; }  // init-only (C# 9) — set once at construction
    public int    Age   { get; private set; }

    // Primary-style constructor
    public Animal(string name, string sound, int age)
    {
        Name  = name;
        Sound = sound;
        Age   = Math.Max(0, age);   // validation
    }

    // Method
    public string Speak() => $"{Name} says '{Sound}'!";

    // Override ToString
    public override string ToString() => $"Animal({Name}, age {Age})";
}

// Inheritance
public class Dog : Animal
{
    public string Breed { get; }

    public Dog(string name, string breed, int age)
        : base(name, "Woof", age)   // call base constructor
    {
        Breed = breed;
    }

    public override string ToString() => $"Dog({Name}, {Breed}, age {Age})";
}

// Object initializer (no special constructor needed for settable props)
var cat = new Animal("Whiskers", "Meow", 3);
Console.WriteLine(cat.Speak());
Console.WriteLine(cat);

var dog = new Dog("Rex", "German Shepherd", 5);
Console.WriteLine(dog.Speak());
Console.WriteLine(dog);

// Polymorphism — Animal reference to Dog instance
Animal animal = dog;
Console.WriteLine(animal.Speak());`,
    output: `Whiskers says 'Meow'!
Animal(Whiskers, age 3)
Rex says 'Woof'!
Dog(Rex, German Shepherd, age 5)
Rex says 'Woof'!`,
    notes: [
      "`init` properties (C# 9) allow setting in constructors/initializers but not afterwards.",
      "Always call `base(...)` explicitly when the base class has no parameterless constructor.",
      "Override `ToString()` to make objects more readable in logs and debugging.",
    ],
  },
  {
    id: 7,
    category: "OOP",
    title: "Interfaces & Polymorphism",
    summary: "Defining and implementing interfaces, coding to abstractions.",
    code: `using System;
using System.Collections.Generic;

// Interface — contract without implementation
public interface IShape
{
    double Area();
    double Perimeter();
    string Describe() => $"Area={Area():F2}, Perimeter={Perimeter():F2}"; // default impl (C# 8+)
}

public class Circle : IShape
{
    public double Radius { get; }
    public Circle(double r) => Radius = r;
    public double Area()      => Math.PI * Radius * Radius;
    public double Perimeter() => 2 * Math.PI * Radius;
}

public class Rectangle : IShape
{
    public double Width  { get; }
    public double Height { get; }
    public Rectangle(double w, double h) { Width = w; Height = h; }
    public double Area()      => Width * Height;
    public double Perimeter() => 2 * (Width + Height);
}

// Polymorphism — operate through the interface
var shapes = new List<IShape>
{
    new Circle(5),
    new Rectangle(4, 6),
    new Circle(2.5),
};

foreach (IShape shape in shapes)
    Console.WriteLine($"{shape.GetType().Name}: {shape.Describe()}");

// LINQ on the list
double totalArea = 0;
foreach (var s in shapes) totalArea += s.Area();
Console.WriteLine($"Total area: {totalArea:F2}");`,
    output: `Circle: Area=78.54, Perimeter=31.42
Rectangle: Area=24.00, Perimeter=20.00
Circle: Area=19.63, Perimeter=15.71
Total area: 122.17`,
    notes: [
      "Code to interfaces (`IShape`), not concrete types — makes code easier to extend and test.",
      "Default interface methods (C# 8+) let you add methods to interfaces without breaking existing implementations.",
      "Interfaces support multiple inheritance unlike classes in C#.",
    ],
  },
  // ── Collections ────────────────────────────────────────────────────────────
  {
    id: 8,
    category: "Collections",
    title: "List, Dictionary & HashSet",
    summary: "The most commonly used generic collections and their trade-offs.",
    code: `using System;
using System.Collections.Generic;

// List<T> — ordered, index-accessible, allows duplicates
var fruits = new List<string> { "Apple", "Banana", "Cherry" };
fruits.Add("Date");
fruits.Remove("Banana");
Console.WriteLine($"List: {string.Join(", ", fruits)}");
Console.WriteLine($"Contains Apple: {fruits.Contains("Apple")}");

// Dictionary<K, V> — key/value store, O(1) average look-up
var scores = new Dictionary<string, int>
{
    ["Alice"] = 95,
    ["Bob"]   = 82,
};
scores["Charlie"] = 88;

if (scores.TryGetValue("Bob", out int bobScore))
    Console.WriteLine($"Bob's score: {bobScore}");

foreach (var (name, score) in scores)
    Console.WriteLine($"  {name}: {score}");

// HashSet<T> — unordered, no duplicates, O(1) membership check
var set1 = new HashSet<int> { 1, 2, 3, 4, 5 };
var set2 = new HashSet<int> { 3, 4, 5, 6, 7 };
set1.IntersectWith(set2);
Console.WriteLine($"Intersection: {string.Join(", ", set1)}");   // 3, 4, 5`,
    output: `List: Apple, Cherry, Date
Contains Apple: True
Bob's score: 82
  Alice: 95
  Bob: 82
  Charlie: 88
Intersection: 3, 4, 5`,
    notes: [
      "Always use `TryGetValue` instead of `ContainsKey` + indexer — single lookup vs two.",
      "`HashSet` is ideal for membership tests and set operations (union, intersect, except).",
      "Dictionary iteration order is NOT guaranteed (use `SortedDictionary` for sorted keys).",
    ],
  },
  // ── LINQ ────────────────────────────────────────────────────────────────────
  {
    id: 9,
    category: "LINQ",
    title: "LINQ Essentials",
    summary: "Where, Select, OrderBy, GroupBy, First, Any, All, Aggregate — the operators you'll use every day.",
    code: `using System;
using System.Collections.Generic;
using System.Linq;

var people = new List<(string Name, int Age, string City)>
{
    ("Alice",  30, "London"),
    ("Bob",    25, "Paris"),
    ("Carol",  35, "London"),
    ("Dave",   28, "Paris"),
    ("Eve",    22, "Tokyo"),
};

// Where + Select
var londonNames = people
    .Where(p  => p.City == "London")
    .Select(p => p.Name)
    .ToList();
Console.WriteLine($"London: {string.Join(", ", londonNames)}");

// OrderBy + ThenBy
var sorted = people.OrderBy(p => p.City).ThenBy(p => p.Age);
foreach (var p in sorted)
    Console.WriteLine($"  {p.Name} ({p.Age}) — {p.City}");

// GroupBy
var byCity = people.GroupBy(p => p.City);
foreach (var g in byCity)
    Console.WriteLine($"{g.Key}: {string.Join(", ", g.Select(p => p.Name))}");

// Aggregates
int  totalAge = people.Sum(p => p.Age);
double avgAge = people.Average(p => p.Age);
Console.WriteLine($"Total age: {totalAge}, Avg: {avgAge:F1}");

// Any / All / Count
Console.WriteLine($"Any under 25: {people.Any(p => p.Age < 25)}");
Console.WriteLine($"All over 18:  {people.All(p => p.Age > 18)}");
Console.WriteLine($"Count in Paris: {people.Count(p => p.City == "Paris")}");`,
    output: `London: Alice, Carol
  Eve (22) — Tokyo
  Bob (25) — Paris
  Dave (28) — Paris
  Alice (30) — London
  Carol (35) — London
London: Alice, Carol
Paris: Bob, Dave
Tokyo: Eve
Total age: 140, Avg: 28.0
Any under 25: True
All over 18:  True
Count in Paris: 2`,
    notes: [
      "LINQ queries are lazy (deferred execution) — they run when iterated, not when defined. Call `.ToList()` to materialise immediately.",
      "Avoid repeated `.Where(...).Count()` — use `.Count(predicate)` directly.",
      "Method syntax (fluent) and query syntax (`from x in ...`) compile to the same IL.",
    ],
  },
  // ── Async ────────────────────────────────────────────────────────────────────
  {
    id: 10,
    category: "Async",
    title: "async / await Basics",
    summary: "Writing non-blocking asynchronous code with `Task`, `async`, and `await`.",
    code: `using System;
using System.Net.Http;
using System.Threading.Tasks;

// Simple async method
static async Task<int> GetDelayedValueAsync(int delayMs)
{
    await Task.Delay(delayMs);   // non-blocking wait
    return 42;
}

// Running multiple tasks in parallel
static async Task RunParallelAsync()
{
    var t1 = GetDelayedValueAsync(100);
    var t2 = GetDelayedValueAsync(200);
    var t3 = GetDelayedValueAsync(150);

    // Await all at once — total time ≈ max(100, 200, 150) = 200ms
    int[] results = await Task.WhenAll(t1, t2, t3);
    Console.WriteLine($"Results: {string.Join(", ", results)}");
}

// async Main (C# 7.1+)
static async Task Main()
{
    // Sequential await
    int val = await GetDelayedValueAsync(50);
    Console.WriteLine($"Got: {val}");

    await RunParallelAsync();

    // ConfigureAwait(false) — avoids capturing the sync context (use in libraries)
    int val2 = await GetDelayedValueAsync(50).ConfigureAwait(false);
    Console.WriteLine($"Got without context: {val2}");
}`,
    output: `Got: 42
Results: 42, 42, 42
Got without context: 42`,
    notes: [
      "Never use `async void` except for event handlers — it makes exceptions unobservable.",
      "Use `Task.WhenAll` to run independent async operations in parallel instead of awaiting them sequentially.",
      "Use `ConfigureAwait(false)` in library code to avoid deadlocks in UI/ASP.NET classic contexts.",
    ],
  },
];
