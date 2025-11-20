import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { themeClasses } from './themeClasses';

export const CountryCodeDropdown = ({ value, onChange, className = '' }) => {
  const theme = useSelector((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const countryCodes = [
    { code: '+1', country: 'US' },
    { code: '+1', country: 'Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+61', country: 'Australia' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+7', country: 'Russia' },
    { code: '+82', country: 'South Korea' },
    { code: '+31', country: 'Netherlands' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+41', country: 'Switzerland' },
    { code: '+48', country: 'Poland' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search
  const filteredCountries = countryCodes.filter(country => 
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected country
  const selectedCountry = countryCodes.find(c => c.code === value);

  return (
    <div className={`relative ${className} `} ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 rounded-l-full w-full px-3 border rounded outline-none flex items-center justify-center transition-colors ${
          themeClasses[theme].border
        } ${
          themeClasses[theme].inputBg
        } ${
          themeClasses[theme].text
        } hover:${themeClasses[theme].hover}`}
      >
        <span className="font-mono">{selectedCountry?.code || '+1'}</span>
        <svg 
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''} ${themeClasses[theme].icon}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-50 w-40 mt-1 rounded-lg shadow-lg border max-h-60 overflow-hidden ${
          themeClasses[theme].dropdownBg
        } ${
          themeClasses[theme].border
        }`}>
          {/* Search Input */}
          <div className={`p-2 border-b sticky top-0 ${
            themeClasses[theme].dropdownBg
          } ${
            themeClasses[theme].border
          }`}>
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 border rounded outline-none ${
                themeClasses[theme].border
              } ${
                themeClasses[theme].inputBg
              } ${
                themeClasses[theme].text
              } focus:${
                themeClasses[theme].focusBorder
              }`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Country List */}
          <div className="overflow-y-auto max-h-48">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <button
                  key={`${country.code}-${index}`}
                  type="button"
                  onClick={() => {
                    onChange(country.code);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${
                    value === country.code 
                      ? themeClasses[theme].dropdownItemSelected 
                      : themeClasses[theme].dropdownItemHover
                  }`}
                >
                  <span className={`font-mono font-semibold ${
                    themeClasses[theme].text
                  }`}>
                    {country.code}
                  </span>
                  <span className={`text-sm ml-2 truncate ${
                    themeClasses[theme].textMuted
                  }`}>
                    {country.country}
                  </span>
                </button>
              ))
            ) : (
              <div className={`px-4 py-3 text-center text-sm ${
                themeClasses[theme].textMuted
              }`}>
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};