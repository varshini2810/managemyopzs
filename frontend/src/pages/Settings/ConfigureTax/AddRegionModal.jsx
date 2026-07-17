import React, { useState, useRef, useEffect } from "react";
import { X, Search, Check } from "lucide-react"; // Full country list with flags
const ALL_COUNTRIES = [
  { code: "EU", name: "EU Region", flag: "🇪🇺" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AX", name: "Aland Islands", flag: "🇦🇽" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AS", name: "American Samoa", flag: "🇦🇸" },
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "AI", name: "Anguilla", flag: "🇦🇮" },
  { code: "AQ", name: "Antarctica", flag: "🇦🇶" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AW", name: "Aruba", flag: "🇦🇼" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "BM", name: "Bermuda", flag: "🇧🇲" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "IO", name: "British Indian Ocean Territory", flag: "🇮🇴" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "KY", name: "Cayman Islands", flag: "🇰🇾" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CX", name: "Christmas Island", flag: "🇨🇽" },
  { code: "CC", name: "Cocos Islands", flag: "🇨🇨" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CD", name: "Congo (DRC)", flag: "🇨🇩" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CW", name: "Curaçao", flag: "🇨🇼" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FK", name: "Falkland Islands", flag: "🇫🇰" },
  { code: "FO", name: "Faroe Islands", flag: "🇫🇴" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GF", name: "French Guiana", flag: "🇬🇫" },
  { code: "PF", name: "French Polynesia", flag: "🇵🇫" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GI", name: "Gibraltar", flag: "🇬🇮" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GL", name: "Greenland", flag: "🇬🇱" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "GP", name: "Guadeloupe", flag: "🇬🇵" },
  { code: "GU", name: "Guam", flag: "🇬🇺" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "GG", name: "Guernsey", flag: "🇬🇬" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IM", name: "Isle of Man", flag: "🇮🇲" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JE", name: "Jersey", flag: "🇯🇪" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MO", name: "Macao", flag: "🇲🇴" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "MQ", name: "Martinique", flag: "🇲🇶" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "YT", name: "Mayotte", flag: "🇾🇹" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MS", name: "Montserrat", flag: "🇲🇸" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NC", name: "New Caledonia", flag: "🇳🇨" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NU", name: "Niue", flag: "🇳🇺" },
  { code: "NF", name: "Norfolk Island", flag: "🇳🇫" },
  { code: "MP", name: "Northern Mariana Islands", flag: "🇲🇵" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "PS", name: "Palestine", flag: "🇵🇸" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PN", name: "Pitcairn Islands", flag: "🇵🇳" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RE", name: "Réunion", flag: "🇷🇪" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "BL", name: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "SH", name: "Saint Helena", flag: "🇸🇭" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "MF", name: "Saint Martin", flag: "🇲🇫" },
  { code: "PM", name: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "ST", name: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SX", name: "Sint Maarten", flag: "🇸🇽" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "GS", name: "South Georgia", flag: "🇬🇸" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "SJ", name: "Svalbard and Jan Mayen", flag: "🇸🇯" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "TK", name: "Tokelau", flag: "🇹🇰" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "TC", name: "Turks and Caicos Islands", flag: "🇹🇨" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UM", name: "US Minor Outlying Islands", flag: "🇺🇲" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "VA", name: "Vatican City", flag: "🇻🇦" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "VG", name: "Virgin Islands (British)", flag: "🇻🇬" },
  { code: "VI", name: "Virgin Islands (US)", flag: "🇻🇮" },
  { code: "WF", name: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "EH", name: "Western Sahara", flag: "🇪🇭" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
];
export default function AddRegionModal({
  isOpen,
  onClose,
  onAdd,
  existingCodes = [],
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const searchRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelected(null);
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const filtered = ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );
  const handleAdd = () => {
    if (!selected) return;
    onAdd(selected);
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,19,15,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {" "}
      <div
        className="bg-white rounded-xl border border-border shadow-lg w-full max-w-sm flex flex-col overflow-hidden"
        style={{ maxHeight: "80vh", animation: "scaleIn 0.15s ease-out" }}
      >
        {" "}
        {/* Header */}{" "}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0 bg-stone-50">
          {" "}
          <h2 className="text-sm font-semibold text-ink">Add Region</h2>{" "}
          <button
            id="add-region-close-btn"
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors"
          >
            {" "}
            <X size={16} />{" "}
          </button>{" "}
        </div>{" "}
        {/* Search */}{" "}
        <div className="px-4 py-3 border-b border-border shrink-0">
          {" "}
          <div className="relative">
            {" "}
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />{" "}
            <input
              ref={searchRef}
              id="region-search-input"
              type="text"
              placeholder="Search country..."
              className="input pl-8 text-sm py-1.5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Country List */}{" "}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {" "}
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted">
              No results for "{search}"
            </div>
          ) : (
            filtered.map((country) => {
              const alreadyAdded = existingCodes.includes(country.code);
              const isSelected = selected?.code === country.code;
              return (
                <button
                  key={country.code}
                  id={`region-option-${country.code}`}
                  disabled={alreadyAdded}
                  onClick={() => !alreadyAdded && setSelected(country)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${alreadyAdded ? "opacity-40 cursor-not-allowed" : "hover:bg-stone-50 cursor-pointer"} ${isSelected ? "bg-blue-50" : ""} `}
                >
                  {" "}
                  <span className="text-lg leading-none">
                    {country.flag}
                  </span>{" "}
                  <span
                    className={`text-sm flex-1 ${isSelected ? "font-medium text-accent" : "text-ink"}`}
                  >
                    {" "}
                    {country.name}{" "}
                  </span>{" "}
                  {alreadyAdded && (
                    <span className="text-2xs text-muted bg-stone-100 px-1.5 py-0.5 rounded">
                      Added
                    </span>
                  )}{" "}
                  {isSelected && !alreadyAdded && (
                    <Check size={14} style={{ color: "#2D5BFF" }} />
                  )}{" "}
                </button>
              );
            })
          )}{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="px-4 py-3 border-t border-border shrink-0 bg-stone-50 flex justify-end gap-2">
          {" "}
          <button
            id="add-region-cancel-btn"
            type="button"
            onClick={onClose}
            className="btn-secondary btn-sm"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            id="add-region-confirm-btn"
            type="button"
            disabled={!selected}
            onClick={handleAdd}
            className="btn-primary btn-sm"
          >
            {" "}
            Add Region{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <style>{` @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } `}</style>{" "}
    </div>
  );
}
