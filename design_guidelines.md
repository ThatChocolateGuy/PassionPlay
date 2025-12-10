# Design Guidelines: Adult Truth or Dare Generator

## Design Approach

**Selected Approach:** Custom Modern Design with Premium Adult Aesthetic

This app requires a sophisticated, sensual atmosphere that balances playfulness with tasteful intimacy. Drawing inspiration from premium adult lifestyle brands, we'll create a sleek, modern interface with warm, inviting tones that feel intimate without being tacky.

## Core Design Elements

### Typography
- **Primary Font:** Inter or DM Sans via Google Fonts (clean, modern, approachable)
- **Display/Headers:** Bold weights (700-800) for category buttons and main prompts
- **Body Text:** Regular (400) and Medium (500) for truths/dares and descriptions
- **Sizes:** Large display text (text-4xl to text-6xl) for generated prompts, medium (text-lg to text-xl) for buttons and labels, body (text-base) for supporting text

### Layout System
**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 20 (p-4, gap-6, mb-8, py-12, etc.)
- Centered, card-based layout with generous padding
- Maximum width container: max-w-2xl for main content area
- Consistent spacing between interactive elements and content sections

### Component Library

**Core Components:**

1. **Main Prompt Card**
   - Large, centered card displaying truth or dare
   - Substantial padding (p-12 to p-16)
   - Rounded corners (rounded-2xl or rounded-3xl)
   - Prominent typography for the generated prompt
   - Player name integration within prompt text when applicable

2. **Category Selection**
   - Three intensity level buttons: "Mild," "Spicy," "Extreme"
   - Horizontal button group layout
   - Clear active state indication
   - Equal width buttons with consistent spacing

3. **Action Buttons**
   - Primary: "Generate Truth" and "Generate Dare" as prominent CTAs
   - Secondary: Category selectors
   - Generous touch targets (min h-12 to h-14)
   - Clear hierarchy through size and visual weight

4. **Player Name Input**
   - Clean text input field for adding player names
   - List display of added players with remove option
   - Simple, unobtrusive design that doesn't distract from main experience

5. **Header/Title**
   - App title with playful, confident typography
   - Subtitle or tagline explaining the intensity system
   - Clean, minimal header design

### Visual Atmosphere

**Mood:** Sophisticated intimacy - premium, adult, inviting
- Gradient backgrounds using deep reds, purples, and warm tones
- Subtle blur effects (backdrop-blur) on cards for depth
- Soft shadows for elevation without harshness
- Smooth transitions on all interactive elements (transition-all duration-300)

**Specific Treatments:**
- Cards with semi-transparent backgrounds over gradient backdrop
- Glow effects on active/selected states
- Smooth fade-in animations when generating new prompts
- Subtle scale transforms on button interactions

### Layout Structure

**Single-Page Application:**
1. **Header Section** - App title and description
2. **Player Management** - Name input and player list (collapsible or sidebar)
3. **Category Selection** - Intensity level buttons
4. **Main Prompt Display** - Large card showing current truth/dare
5. **Action Buttons** - Generate truth/dare CTAs
6. **Footer** - Minimal, optional credits or settings

### Interaction Patterns

- Instant category switching with visual feedback
- Smooth fade transitions when generating new prompts (animate prompt change)
- Button states clearly indicate clickability and active selection
- Random generation feels immediate and satisfying
- Player names dynamically inserted into prompts naturally

### Images
**No images required** - This is a text-based interactive app. The visual appeal comes from gradients, colors, typography, and smooth interactions rather than imagery.

### Mobile Optimization
- Full-screen mobile experience
- Large touch targets for all buttons
- Vertical stacking of elements on small screens
- Maintained readability and generous spacing on all devices