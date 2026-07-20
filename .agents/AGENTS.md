# Design Tokens for ManageMyMarketing

Every future UI element, component, or screen built for this project MUST strictly follow these design values without deviation.

## Colors
- **Primary**: `#586EF0`
- **Primary Hover**: `#7084F4`
- **Danger/Error**: `#EF4444`
- **Workspace Background**: `#F4F7FA`
- **Gray Border**: `#E5E7EB`
- **Gray Divider**: `#D9DBE1`
- **Placeholder Text**: `#9CA3AF`

## Status/Accent Tones (for card icons, badges)
- **Campaigns / Success**: `#10B981` (Emerald)
- **Expenses / Warning**: `#F59E0B` (Amber)
- **Approvals / Creative**: `#A855F7` (Purple)
- **Information / General**: `#3B82F6` (Blue)

## Typography
**Font**: Inter, sans-serif

- **xxs**: `8px`
- **xs**: `9px`
- **xs-role**: `10px`
- **sm**: `11px`
- **sm-title**: `12px`
- **base**: `13px`
- **lg**: `15px`
- **xl**: `17px`
- **2xl**: `21px` (page titles)
- **3xl**: `33px` (main KPI values)
- **4xl**: `35px`

## Spacing & Radius
- **Input radius**: `10px`
- **Button radius**: `10px`
- **Card radius**: `14px`
- **Card shadow**: `0 2px 10px rgba(15, 23, 42, 0.08)`

## Icons
Use **lucide-react** ONLY.

## Standard KPI Card Component Pattern
Use this reusable reference template for any dashboard/stat card work:

```jsx
<Card className="hover:scale-[1.02] hover:shadow-md transition-all duration-200 cursor-pointer" bodyClassName="p-5 flex items-center justify-between">
  <div>
    <p className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mt-2 font-sans tracking-tight">{value}</p>
  </div>
  <div className="w-10 h-10 rounded-full bg-{accent}/10 text-{accent} flex items-center justify-center border border-{accent}/20 shrink-0">
    <{IconComponent} size={20} />
  </div>
</Card>
```
