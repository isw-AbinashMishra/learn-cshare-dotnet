export const challengeCategories = [
  "Strings",
  "Arrays",
  "Math",
  "Logic",
  "Collections",
];

export const challenges = [
  // ── Strings ────────────────────────────────────────────────────────────────
  {
    id: 1,
    category: "Strings",
    difficulty: "Easy",
    title: "Reverse a String",
    description:
      "Write a C# method `ReverseString(string s)` that returns the characters of the input string in reverse order.\n\nDo **not** use `Array.Reverse` or LINQ as your primary approach — implement it manually to understand the mechanics, then compare with the built-in solution.",
    examples: [
      { input: '"hello"', output: '"olleh"' },
      { input: '"C# rocks"', output: '"skcor #C"' },
      { input: '""', output: '""' },
    ],
    hints: [
      "Convert the string to a `char[]`, then iterate from both ends swapping characters.",
      "A `StringBuilder` loop from `s.Length - 1` down to `0` works cleanly.",
      "One-liner: `new string(s.Reverse().ToArray())` — but understand the manual approach first.",
    ],
    solution: `using System;

// Approach 1 — manual swap (most educational)
static string ReverseString(string s)
{
    char[] chars = s.ToCharArray();
    int left = 0, right = chars.Length - 1;
    while (left < right)
    {
        (chars[left], chars[right]) = (chars[right], chars[left]);
        left++;
        right--;
    }
    return new string(chars);
}

// Approach 2 — LINQ one-liner
static string ReverseStringLinq(string s) =>
    new string(s.Reverse().ToArray());

// Test
Console.WriteLine(ReverseString("hello"));       // olleh
Console.WriteLine(ReverseString("C# rocks"));    // skcor #C
Console.WriteLine(ReverseStringLinq("abcde"));   // edcba`,
    tags: ["string", "two-pointer", "char array"],
  },
  {
    id: 2,
    category: "Logic",
    difficulty: "Easy",
    title: "FizzBuzz",
    description:
      "Print numbers from 1 to `n`. For multiples of 3 print **\"Fizz\"**, for multiples of 5 print **\"Buzz\"**, and for multiples of both 3 and 5 print **\"FizzBuzz\"**. Otherwise print the number.\n\nReturn a `List<string>` instead of just printing so it is testable.",
    examples: [
      { input: "n = 5", output: '["1", "2", "Fizz", "4", "Buzz"]' },
      {
        input: "n = 15",
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
      },
    ],
    hints: [
      "Check the combined condition (`% 3 == 0 && % 5 == 0`) **before** checking each individually.",
      "Alternatively build the result string by concatenating 'Fizz' and/or 'Buzz' conditionally — no nested ifs needed.",
    ],
    solution: `using System;
using System.Collections.Generic;

static List<string> FizzBuzz(int n)
{
    var result = new List<string>(n);
    for (int i = 1; i <= n; i++)
    {
        // Build the label without nested ifs
        string label = "";
        if (i % 3 == 0) label += "Fizz";
        if (i % 5 == 0) label += "Buzz";
        result.Add(label.Length > 0 ? label : i.ToString());
    }
    return result;
}

// Test
Console.WriteLine(string.Join(", ", FizzBuzz(15)));
// 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz`,
    tags: ["modulo", "loop", "classic"],
  },
  {
    id: 3,
    category: "Strings",
    difficulty: "Easy",
    title: "Check Palindrome",
    description:
      "Write a method `IsPalindrome(string s)` that returns `true` if `s` reads the same forwards and backwards (case-insensitive, ignore non-alphanumeric characters).",
    examples: [
      { input: '"racecar"', output: "true" },
      { input: '"A man, a plan, a canal: Panama"', output: "true" },
      { input: '"race a car"', output: "false" },
    ],
    hints: [
      "Strip non-alphanumeric characters with LINQ: `s.Where(char.IsLetterOrDigit)`.",
      "Use a two-pointer approach comparing from both ends after lowercasing.",
      "Or simply compare the cleaned string with its reverse.",
    ],
    solution: `using System;
using System.Linq;

static bool IsPalindrome(string s)
{
    // Keep only alphanumeric, lowercase
    string clean = new string(s.Where(char.IsLetterOrDigit)
                                .Select(char.ToLower)
                                .ToArray());

    // Two-pointer check
    int left = 0, right = clean.Length - 1;
    while (left < right)
    {
        if (clean[left] != clean[right]) return false;
        left++;
        right--;
    }
    return true;
}

Console.WriteLine(IsPalindrome("racecar"));                          // True
Console.WriteLine(IsPalindrome("A man, a plan, a canal: Panama"));  // True
Console.WriteLine(IsPalindrome("race a car"));                       // False`,
    tags: ["string", "two-pointer", "palindrome"],
  },
  {
    id: 4,
    category: "Math",
    difficulty: "Easy",
    title: "Factorial",
    description:
      "Implement `Factorial(int n)` that returns `n!`. Handle both iterative and recursive approaches.\n\n`n!` = n × (n-1) × … × 1, and `0! = 1` by convention.",
    examples: [
      { input: "n = 0", output: "1" },
      { input: "n = 5", output: "120" },
      { input: "n = 10", output: "3628800" },
    ],
    hints: [
      "Base case for recursion: `if (n <= 1) return 1`.",
      "Iterative: accumulate a product starting at 1, multiply up to n.",
      "For large n use `long` or `BigInteger` to avoid overflow.",
    ],
    solution: `using System;
using System.Numerics;

// Iterative (preferred for large n — no stack overflow risk)
static long FactorialIterative(int n)
{
    if (n < 0) throw new ArgumentException("n must be non-negative");
    long result = 1;
    for (int i = 2; i <= n; i++)
        result *= i;
    return result;
}

// Recursive (elegant, limited by stack depth)
static long FactorialRecursive(int n)
{
    if (n < 0) throw new ArgumentException("n must be non-negative");
    return n <= 1 ? 1 : n * FactorialRecursive(n - 1);
}

// BigInteger for very large values
static BigInteger FactorialBig(int n) =>
    n <= 1 ? BigInteger.One : (BigInteger)n * FactorialBig(n - 1);

Console.WriteLine(FactorialIterative(0));  // 1
Console.WriteLine(FactorialIterative(5));  // 120
Console.WriteLine(FactorialBig(20));       // 2432902008176640000`,
    tags: ["math", "recursion", "iteration"],
  },
  {
    id: 5,
    category: "Math",
    difficulty: "Easy",
    title: "Fibonacci Sequence",
    description:
      "Return the `n`-th Fibonacci number (0-indexed), where `F(0) = 0`, `F(1) = 1`, and `F(n) = F(n-1) + F(n-2)` for n ≥ 2.\n\nImplement both the naïve recursive and an efficient iterative version.",
    examples: [
      { input: "n = 0", output: "0" },
      { input: "n = 6", output: "8" },
      { input: "n = 10", output: "55" },
    ],
    hints: [
      "Naïve recursion has exponential time O(2ⁿ) — use memoization or iteration for larger n.",
      "Iterative: keep track of only the previous two numbers.",
      "Dictionary-based memoization with a static dictionary avoids repeated sub-problem work.",
    ],
    solution: `using System;
using System.Collections.Generic;

// O(2^n) — for understanding only
static long FibRecursive(int n) =>
    n <= 1 ? n : FibRecursive(n - 1) + FibRecursive(n - 2);

// O(n) time, O(1) space — preferred
static long FibIterative(int n)
{
    if (n <= 1) return n;
    long prev = 0, curr = 1;
    for (int i = 2; i <= n; i++)
        (prev, curr) = (curr, prev + curr);
    return curr;
}

// O(n) time, O(n) space — memoization
static Dictionary<int, long> _memo = new();
static long FibMemo(int n)
{
    if (n <= 1) return n;
    if (_memo.TryGetValue(n, out long val)) return val;
    return _memo[n] = FibMemo(n - 1) + FibMemo(n - 2);
}

Console.WriteLine(FibIterative(0));   // 0
Console.WriteLine(FibIterative(6));   // 8
Console.WriteLine(FibIterative(10));  // 55
Console.WriteLine(FibIterative(40));  // 102334155`,
    tags: ["fibonacci", "recursion", "dp", "memoization"],
  },
  {
    id: 6,
    category: "Strings",
    difficulty: "Easy",
    title: "Count Vowels",
    description:
      "Write `CountVowels(string s)` that returns the number of vowel characters (a, e, i, o, u — both upper and lower case) in the string.",
    examples: [
      { input: '"Hello World"', output: "3" },
      { input: '"C# Programming"', output: "3" },
      { input: '"rhythm"', output: "0" },
    ],
    hints: [
      'Use a `HashSet<char>` containing all vowels for O(1) look-up.',
      "LINQ `Count` with a predicate is a clean one-liner.",
    ],
    solution: `using System;
using System.Collections.Generic;
using System.Linq;

static int CountVowels(string s)
{
    var vowels = new HashSet<char>("aeiouAEIOU");
    return s.Count(c => vowels.Contains(c));
}

Console.WriteLine(CountVowels("Hello World"));     // 3
Console.WriteLine(CountVowels("C# Programming"));  // 3
Console.WriteLine(CountVowels("rhythm"));          // 0`,
    tags: ["string", "linq", "hashset"],
  },
  {
    id: 7,
    category: "Arrays",
    difficulty: "Easy",
    title: "Find Maximum in Array",
    description:
      "Given an integer array, find and return the maximum value without using `Math.Max` or LINQ's `Max()` — implement the linear scan manually.",
    examples: [
      { input: "[3, 1, 4, 1, 5, 9, 2, 6]", output: "9" },
      { input: "[-4, -2, -7, -1]", output: "-1" },
      { input: "[42]", output: "42" },
    ],
    hints: [
      "Initialise `max` to the first element (not to `int.MinValue`) to handle all-negative arrays correctly.",
      "Iterate from index 1 onward comparing each element to the running `max`.",
    ],
    solution: `using System;

static int FindMax(int[] nums)
{
    if (nums == null || nums.Length == 0)
        throw new ArgumentException("Array must be non-empty");

    int max = nums[0];
    for (int i = 1; i < nums.Length; i++)
    {
        if (nums[i] > max) max = nums[i];
    }
    return max;
}

Console.WriteLine(FindMax(new[] { 3, 1, 4, 1, 5, 9, 2, 6 }));  // 9
Console.WriteLine(FindMax(new[] { -4, -2, -7, -1 }));           // -1
Console.WriteLine(FindMax(new[] { 42 }));                        // 42`,
    tags: ["array", "linear scan"],
  },
  {
    id: 8,
    category: "Strings",
    difficulty: "Easy",
    title: "Check Anagram",
    description:
      "Write `IsAnagram(string a, string b)` that returns `true` if `a` and `b` are anagrams of each other (same characters, same frequencies, case-insensitive, ignoring spaces).",
    examples: [
      { input: '"listen", "silent"', output: "true" },
      { input: '"hello", "world"', output: "false" },
      { input: '"Astronomer", "Moon starer"', output: "true" },
    ],
    hints: [
      "Sort the character arrays of both strings and compare — O(n log n).",
      "Or use a frequency dictionary: increment for chars in `a`, decrement for chars in `b`, check all zeros.",
      "Strip spaces and lowercase both strings first.",
    ],
    solution: `using System;
using System.Linq;

// Approach 1 — sort and compare O(n log n)
static bool IsAnagramSort(string a, string b)
{
    string Clean(string s) =>
        new string(s.ToLower().Where(char.IsLetter).OrderBy(c => c).ToArray());
    return Clean(a) == Clean(b);
}

// Approach 2 — frequency map O(n)
static bool IsAnagram(string a, string b)
{
    a = new string(a.ToLower().Where(char.IsLetter).ToArray());
    b = new string(b.ToLower().Where(char.IsLetter).ToArray());
    if (a.Length != b.Length) return false;

    int[] freq = new int[26];
    for (int i = 0; i < a.Length; i++)
    {
        freq[a[i] - 'a']++;
        freq[b[i] - 'a']--;
    }
    return freq.All(f => f == 0);
}

Console.WriteLine(IsAnagram("listen", "silent"));         // True
Console.WriteLine(IsAnagram("hello", "world"));           // False
Console.WriteLine(IsAnagram("Astronomer", "Moon starer")); // True`,
    tags: ["string", "hashmap", "sorting", "anagram"],
  },
  {
    id: 9,
    category: "Math",
    difficulty: "Easy",
    title: "Sum of Digits",
    description:
      "Write `SumOfDigits(int n)` that returns the sum of all digits of `n`. Handle negative numbers by treating them as positive.",
    examples: [
      { input: "n = 123", output: "6" },
      { input: "n = -456", output: "15" },
      { input: "n = 0", output: "0" },
    ],
    hints: [
      "Use `Math.Abs(n)` to handle negatives.",
      "Extract digits with the modulo operator: `n % 10` gives the last digit; `n /= 10` removes it.",
      "A string-based approach: `n.ToString().Where(char.IsDigit).Sum(c => c - '0')`.",
    ],
    solution: `using System;
using System.Linq;

// Numeric approach
static int SumOfDigits(int n)
{
    n = Math.Abs(n);
    int sum = 0;
    while (n > 0)
    {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

// String approach (concise)
static int SumOfDigitsString(int n) =>
    Math.Abs(n).ToString().Sum(c => c - '0');

Console.WriteLine(SumOfDigits(123));         // 6
Console.WriteLine(SumOfDigits(-456));        // 15
Console.WriteLine(SumOfDigitsString(9999));  // 36`,
    tags: ["math", "digits", "modulo"],
  },
  {
    id: 10,
    category: "Arrays",
    difficulty: "Easy",
    title: "Two Sum",
    description:
      "Given an integer array `nums` and a target integer, return the **indices** of the two numbers that add up to the target. Assume exactly one solution exists and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0, 1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1, 2]" },
      { input: "nums = [3,3], target = 6", output: "[0, 1]" },
    ],
    hints: [
      "Brute force: nested loops O(n²). Fine for small inputs.",
      "Optimal: use a `Dictionary<int, int>` mapping value → index. For each element, check if `target - nums[i]` is already in the map.",
      "Single pass: add to the dictionary as you go.",
    ],
    solution: `using System;
using System.Collections.Generic;

// O(n) — hash map
static int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>(); // value -> index

    for (int i = 0; i < nums.Length; i++)
    {
        int complement = target - nums[i];
        if (seen.TryGetValue(complement, out int j))
            return new[] { j, i };
        seen[nums[i]] = i;
    }
    throw new InvalidOperationException("No solution found");
}

int[] result = TwoSum(new[] { 2, 7, 11, 15 }, 9);
Console.WriteLine($"[{result[0]}, {result[1]}]");  // [0, 1]

result = TwoSum(new[] { 3, 2, 4 }, 6);
Console.WriteLine($"[{result[0]}, {result[1]}]");  // [1, 2]`,
    tags: ["array", "hashmap", "two-sum"],
  },
  {
    id: 11,
    category: "Collections",
    difficulty: "Easy",
    title: "Remove Duplicates from List",
    description:
      "Given a `List<int>`, return a new list with all duplicate values removed while **preserving insertion order**.",
    examples: [
      { input: "[1, 2, 3, 2, 4, 1]", output: "[1, 2, 3, 4]" },
      { input: "[5, 5, 5]", output: "[5]" },
      { input: "[]", output: "[]" },
    ],
    hints: [
      "`HashSet<T>` tracks seen elements; only add to result if not yet seen.",
      "LINQ: `list.Distinct().ToList()` — but understand the manual approach.",
      "Insertion order is maintained because you iterate the original list in order.",
    ],
    solution: `using System;
using System.Collections.Generic;
using System.Linq;

// Manual — O(n) with HashSet
static List<int> RemoveDuplicates(List<int> nums)
{
    var seen = new HashSet<int>();
    var result = new List<int>();
    foreach (int n in nums)
    {
        if (seen.Add(n))  // Add returns false if already present
            result.Add(n);
    }
    return result;
}

// LINQ one-liner
static List<int> RemoveDuplicatesLinq(List<int> nums) =>
    nums.Distinct().ToList();

var input = new List<int> { 1, 2, 3, 2, 4, 1 };
Console.WriteLine(string.Join(", ", RemoveDuplicates(input)));  // 1, 2, 3, 4`,
    tags: ["list", "hashset", "linq", "duplicates"],
  },
  {
    id: 12,
    category: "Strings",
    difficulty: "Easy",
    title: "Count Words",
    description:
      "Write `CountWords(string sentence)` that counts the number of words in a sentence. Words are separated by one or more whitespace characters.",
    examples: [
      { input: '"Hello World"', output: "2" },
      { input: '"  spaces   everywhere  "', output: "2" },
      { input: '"one"', output: "1" },
      { input: '""', output: "0" },
    ],
    hints: [
      '`string.Split` with `StringSplitOptions.RemoveEmptyEntries` handles multiple spaces.',
      "LINQ: `.Split().Where(w => w.Length > 0).Count()`.",
      "Handle the empty / whitespace-only string edge case.",
    ],
    solution: `using System;

static int CountWords(string sentence)
{
    if (string.IsNullOrWhiteSpace(sentence)) return 0;
    return sentence.Split(new char[] { ' ', '\\t', '\\n' },
                          StringSplitOptions.RemoveEmptyEntries).Length;
}

Console.WriteLine(CountWords("Hello World"));          // 2
Console.WriteLine(CountWords("  spaces   everywhere  ")); // 2
Console.WriteLine(CountWords("one"));                  // 1
Console.WriteLine(CountWords(""));                     // 0`,
    tags: ["string", "split", "words"],
  },
];
