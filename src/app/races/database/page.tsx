// src/app/races/database/page.tsx

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { 
  ColDef, 
  GridApi,
  ModuleRegistry, 
  GridReadyEvent,
  FilterChangedEvent 
} from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import Papa from 'papaparse'
import { BRAND } from '@/lib/constants'
import NewsletterSignup from '@/components/NewsletterSignup'

// Import AG Grid styles
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'

// Register AG Grid modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule
])

// Define the type for our race data
interface RaceData {
  Race: string;
  Country: string;
  'Country Code'?: string;
  Distance: string;
  Surface: string;
  'Elevation profile'?: string;
  'Elevation Gain'?: string;
  'Elevation Gain ft'?: string;
  'Average Temp (high)'?: string;
  'Average Temp F'?: string;
  'Field Size'?: number;
  'Course Record (Mens)'?: string;
  'Course Record (Womens)'?: string;
  When: string;
  'Entry opens'?: string;
  'Entry Fee'?: string;
  'World Athletics Label'?: string;
  Series?: string;
  Website?: string;
  [key: string]: any;
}

// Unit display type
type UnitSystem = 'metric' | 'imperial';

// Value formatter interface
interface ValueFormatterParams {
  value: any;
}

// Responsive viewport size detector
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
}

// Country flag cell renderer
const CountryFlagRenderer = (params: { data?: RaceData }) => {
  const country = params.data?.Country;
  const countryCode = params.data?.['Country Code'];

  if (!country) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {countryCode && (
        <img 
          src={`https://flagcdn.com/20x15/${countryCode.toLowerCase()}.png`} 
          alt={country}
          style={{ marginRight: '8px', width: '20px', height: '15px' }}
        />
      )}
      <span>{country}</span>
    </div>
  );
};

// Race name cell renderer with website link
const RaceNameLinkRenderer = (params: { data?: RaceData }) => {
  const raceName = params.data?.Race;
  const website = params.data?.Website;

  if (!raceName) return null;

  if (website && website.toString().trim() !== '') {
    return (
      <a 
        href={website.toString().startsWith('http') ? website.toString() : `https://${website}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="race-name-link hover:underline"
      >
        {raceName}
      </a>
    );
  }

  return <span>{raceName}</span>;
};

// Helper functions to convert metric to imperial
const metricToImperial = {
  // Meters to feet (multiply by 3.28084)
  elevationConverter: (meters: any): string => {
    if (!meters || isNaN(parseFloat(meters.toString()))) return "";
    return Math.round(parseFloat(meters.toString()) * 3.28084).toString();
  },
  
  // Celsius to Fahrenheit (multiply by 9/5 and add 32)
  temperatureConverter: (celsius: any): string => {
    if (!celsius || isNaN(parseFloat(celsius.toString()))) return "";
    return Math.round((parseFloat(celsius.toString()) * 9/5) + 32).toString();
  }
};

// Value formatter to display units
const ValueWithUnitFormatter = (params: ValueFormatterParams, unit: string) => {
  if (!params.value || params.value === '') return '';
  return `${params.value} ${unit}`;
};

export default function RaceDatabasePage() {
  const [rowData, setRowData] = useState<RaceData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [activeFilters, setActiveFilters] = useState<{[key: string]: number}>({})
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [selectedCountry, setSelectedCountry] = useState<string>('')       // <-- added
  const [selectedDistance, setSelectedDistance] = useState<string>('')     // <-- added
  const gridApiRef = useRef<GridApi | null>(null)
  const isMobile = useIsMobile()

  // Get column definitions based on unit preference and screen size
  const getColumnDefs = useCallback((unitPreference: UnitSystem, isMobileView: boolean): ColDef[] => {
    // Base columns that are always shown
    const baseColumns: ColDef[] = [
      { 
        field: 'Race', 
        headerName: 'Race', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: isMobileView ? 150 : 250, 
        flex: 2, 
        resizable: true, 
        sort: 'asc',
        cellRenderer: RaceNameLinkRenderer,
      },
      { 
        field: 'Country', 
        headerName: 'Country', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: isMobileView ? 130 : 180, 
        flex: 1, 
        resizable: true, 
        cellRenderer: CountryFlagRenderer 
      },
      { 
        field: 'Distance', 
        headerName: 'Distance', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: isMobileView ? 100 : 140, 
        flex: 1, 
        resizable: true 
      },
    ];
    
    // Always include the conditions unit columns
    const unitColumns = [
      ...(unitPreference === 'metric' ? [{
        field: 'Elevation Gain',
        headerName: isMobileView ? 'Elev.' : 'Elevation Gain',
        sortable: true,
        filter: 'agNumberColumnFilter',
        minWidth: isMobileView ? 90 : 160,
        flex: 1,
        resizable: true,
        valueFormatter: (params: ValueFormatterParams) => {
          if (!params.value || params.value === '') return '';
          return `${params.value} m`;
        }
      }] : [{
        field: 'Elevation Gain ft',
        headerName: isMobileView ? 'Elev.' : 'Elevation Gain',
        sortable: true,
        filter: 'agNumberColumnFilter',
        minWidth: isMobileView ? 90 : 160,
        flex: 1,
        resizable: true,
        valueGetter: (params: any) => {
          // First try to get the value directly from Elevation Gain ft field
          const ftValue = params.data?.['Elevation Gain ft'];
          if (ftValue && ftValue !== '') return ftValue;
          
          // If not available, convert from meters
          const mValue = params.data?.['Elevation Gain'];
          return metricToImperial.elevationConverter(mValue);
        },
        valueFormatter: (params: ValueFormatterParams) => {
          if (!params.value || params.value === '') return '';
          return `${params.value} ft`;
        }
      }]),
      ...(unitPreference === 'metric' ? [{
        field: 'Average Temp (high)',
        headerName: isMobileView ? 'Temp' : 'Avg Temp (High)',
        sortable: true,
        filter: 'agNumberColumnFilter',
        minWidth: isMobileView ? 90 : 160,
        flex: 1,
        resizable: true,
        valueFormatter: (params: ValueFormatterParams) => {
          if (!params.value || params.value === '') return '';
          return `${params.value} °C`;
        }
      }] : [{
        field: 'Average Temp F',
        headerName: isMobileView ? 'Temp' : 'Avg Temp (High)',
        sortable: true,
        filter: 'agNumberColumnFilter',
        minWidth: isMobileView ? 90 : 160,
        flex: 1,
        resizable: true,
        valueGetter: (params: any) => {
          // First try to get the value directly from Average Temp F field
          const fValue = params.data?.['Average Temp F'];
          if (fValue && fValue !== '') return fValue;
          
          // If not available, convert from Celsius
          const cValue = params.data?.['Average Temp (high)'];
          return metricToImperial.temperatureConverter(cValue);
        },
        valueFormatter: (params: ValueFormatterParams) => {
          if (!params.value || params.value === '') return '';
          return `${params.value} °F`;
        }
      }]),
    ];
    
    // Columns to show only on desktop
    const desktopOnlyColumns: ColDef[] = [
      { 
        field: 'Surface', 
        headerName: 'Surface', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: 140, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'Elevation profile', 
        headerName: 'Elevation Profile', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: 180, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'Field Size', 
        headerName: 'Field Size', 
        sortable: true, 
        filter: 'agNumberColumnFilter',
        minWidth: 130, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'Course Record (Mens)', 
        headerName: 'Men\'s Record',
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: 160, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'Course Record (Womens)', 
        headerName: 'Women\'s Record',
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: 180, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'Entry opens', 
        headerName: 'Entry Opens', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: 150, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'Entry Fee', 
        headerName: 'Entry Fee', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: 130, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'World Athletics Label', 
        headerName: 'World Athletics Label', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: 200, 
        flex: 1, 
        resizable: true 
      },
    ];
    
    // Always include When and Series columns
    const additionalBaseColumns: ColDef[] = [
      { 
        field: 'When', 
        headerName: 'Month', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: isMobileView ? 100 : 130, 
        flex: 1, 
        resizable: true 
      },
      { 
        field: 'Series', 
        headerName: 'Series', 
        sortable: true, 
        filter: 'agTextColumnFilter',
        minWidth: isMobileView ? 160 : 240, 
        flex: 1.5, 
        resizable: true 
      }
    ];
    
    // Combine the columns based on screen size
    return [
      ...baseColumns,
      ...unitColumns,
      ...additionalBaseColumns,
      ...(isMobileView ? [] : desktopOnlyColumns)
    ];
  }, []);

  // Initial column definitions
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(() => getColumnDefs('metric', isMobile));

  // Update columns when unit system changes or screen size changes
  useEffect(() => {
    setColumnDefs(getColumnDefs(unitSystem, isMobile));
  }, [unitSystem, isMobile, getColumnDefs]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    floatingFilter: false, // Disable floating filters for community version
    wrapText: false, // Don't wrap text in cells
    autoHeight: false, // Fixed height cells
  }

  // Handle search input change
  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
  }, []);

  // Toggle between metric and imperial units
  const toggleUnitSystem = useCallback(() => {
    setUnitSystem(prev => prev === 'metric' ? 'imperial' : 'metric');
  }, []);

  // Handle filter changes
  const onFilterChanged = useCallback((event: FilterChangedEvent) => {
    if (!gridApiRef.current) return;
    
    const filterModel = gridApiRef.current.getFilterModel();
    const newActiveFilters: {[key: string]: number} = {};
    
    Object.keys(filterModel).forEach(key => {
      newActiveFilters[key] = 1;
    });
    
    setActiveFilters(newActiveFilters);
  }, []);

const clearFilters = useCallback(() => {
  if (gridApiRef.current) {
    gridApiRef.current.setFilterModel(null);
    setSearchText('');
    setSelectedCountry('');
    setSelectedDistance('');
  }
}, []);


  // Grid ready handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    
    // Custom column sizing function to avoid text wrapping
    const adjustColumnWidths = () => {
      if (!gridApiRef.current) return;
      
      // First autosize all columns
      const allColumnIds: string[] = [];
      gridApiRef.current.getColumnDefs()?.forEach((column: any) => {
        if (column.field) {
          allColumnIds.push(column.field);
        }
      });
      
      gridApiRef.current.autoSizeColumns(allColumnIds, false);
      
      // Then add a little extra padding to make sure headers don't wrap
      setTimeout(() => {
        if (!gridApiRef.current) return;
        gridApiRef.current.sizeColumnsToFit();
      }, 100);
    };
    
    // Apply sizing once data is loaded
    if (rowData && rowData.length > 0) {
      setTimeout(adjustColumnWidths, 0);
    }
    
    // Set up resize handler
    const handleResize = () => {
      setTimeout(adjustColumnWidths, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [rowData]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vTEKpQomG_1thu0Hni94474R1cpCMNiWrkkAXCo_TmS4kvCOWscDDlNAaChKbFxafaUw_maTFKxrvtD/pub?output=csv'
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text()

        const result = Papa.parse<RaceData>(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true, // Automatically convert numeric values
          transformHeader: (header) => header.trim() // Clean up headers
        })
        
        if (result.errors.length) {
          console.error('Parsing errors:', result.errors)
          setError(`Data parsing error: ${result.errors[0].message}`);
        }

        setRowData(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(`Failed to load race data. Please try again later.`);
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Custom CSS for AG Grid to match brand colors - Light theme
  const gridTheme = {
    '--ag-background-color': BRAND.colors.white,
    '--ag-foreground-color': BRAND.colors.dark,
    '--ag-border-color': '#e5e7eb',
    '--ag-header-background-color': BRAND.colors.light,
    '--ag-odd-row-background-color': BRAND.colors.white,
    '--ag-header-foreground-color': BRAND.colors.dark,
    '--ag-row-hover-color': `${BRAND.colors.primary}10`,
    '--ag-selected-row-background-color': `${BRAND.colors.primary}20`,
    '--ag-input-focus-border-color': BRAND.colors.primary,
    '--ag-range-selection-border-color': BRAND.colors.primary,
    '--ag-range-selection-background-color': `${BRAND.colors.primary}20`,
    '--ag-checkbox-checked-color': BRAND.colors.primary,
    '--ag-checkbox-unchecked-color': BRAND.colors.muted,
    '--ag-alpine-active-color': BRAND.colors.primary
  }
  
  useEffect(() => {
    // Add a style tag to handle focus states that can't be done inline
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .search-input:focus {
        border-color: ${BRAND.colors.primary} !important;
        box-shadow: 0 0 0 1px ${BRAND.colors.primary} !important;
      }
      .search-input::placeholder {
        color: ${BRAND.colors.muted};
      }
      .ag-theme-quartz {
        --ag-checkbox-checked-color: ${BRAND.colors.primary};
        --ag-selected-row-background-color: ${BRAND.colors.primary}20;
        --ag-row-hover-color: ${BRAND.colors.primary}10;
      }
      .unit-toggle-btn {
        border: 1px solid #e5e7eb;
        background-color: ${BRAND.colors.dark};
        color: ${BRAND.colors.white};
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        min-height: 44px; /* Touch-friendly size */
      }
      .unit-toggle-btn:hover {
        background-color: #333333;
      }
      .unit-toggle-btn:focus {
        outline: none;
        border-color: ${BRAND.colors.primary};
        box-shadow: 0 0 0 1px ${BRAND.colors.primary};
      }
      .race-name-link {
        color: ${BRAND.colors.dark} !important;
        text-decoration: none;
        font-weight: 700;
      }
      .race-name-link:hover {
        text-decoration: underline;
      }
      .search-tips-btn {
        color: ${BRAND.colors.dark};
        font-weight: 500;
        transition: color 0.2s ease;
        min-width: 44px; /* Touch-friendly size */
        min-height: 44px; /* Touch-friendly size */
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .search-tips-btn:hover {
        color: ${BRAND.colors.primary};
      }
      #search-tooltip {
        transition: opacity 0.3s ease, visibility 0.3s ease;
        visibility: visible;
        opacity: 1;
        left: 0;
        right: auto;
      }
      #search-tooltip.hidden {
        visibility: hidden;
        opacity: 0;
        display: block;
        pointer-events: none;
      }
      .search-tips-container {
        position: relative;
        display: inline-block;
      }
      
      /* Mobile optimizations */
      @media (max-width: 640px) {
        .page-container {
          padding-left: 12px;
          padding-right: 12px;
        }
        .ag-header-cell-text {
          white-space: normal;
          overflow: visible;
        }
        .search-section {
          margin-bottom: 1rem;
        }
        .filter-badges {
          margin-top: 0.5rem;
        }
        .grid-container {
          height: 70vh;
          min-height: 400px;
        }
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Render loading skeleton
  if (loading) {
    return (
      <div className="mx-auto px-10 lg:px-32 pt-32 lg:pt-32 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[68px] font-[550] leading-[75px] font-playfair text-dark mb-4">Race Database</h1>
          <p className="text-[24px] font-[500] leading-[31px] text-muted">Loading race information...</p>
        </div>
        
        {/* Skeleton loader */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full max-w-md"></div>
          <div className="h-64 sm:h-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="mx-auto px-10 lg:px-32 pt-32 lg:pt-32 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[68px] font-[550] leading-[75px] font-playfair text-dark mb-4">Race Database</h1>
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-8">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded text-white text-sm min-h-[44px]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto px-10 lg:px-32 pt-32 lg:pt-32 py-16">
        {/* Header section with consistent spacing and styling */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[68px] font-[550] leading-[75px] font-playfair text-dark mb-4">
            Race Database
          </h1>
          <p className="text-[24px] font-[450] leading-[31px] text-dark">
            Comprehensive database of global running events.
          </p>
        </div>
        
        {/* Toolbar with search, unit toggle, and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 search-section">
          {/* Search input with tooltip - now with fixed width */}
          <div className="relative w-full sm:w-auto flex items-center">
            <div className="relative w-full sm:w-128">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={BRAND.colors.muted} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchText}
                onChange={onSearchChange}
                placeholder="Search race names, countries, distances, etc..."
                className="search-input w-full pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 min-h-[44px]"
                style={{
                  borderColor: '#e5e7eb',
                  backgroundColor: BRAND.colors.white,
                  color: BRAND.colors.dark,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'none',
                  width: isMobile ? '100%' : '32rem'
                }}
              />
            </div>
            
            {/* Search tips icon */}
            <div className="search-tips-container ml-2">
              <span 
                className="flex items-center justify-center search-tips-btn cursor-pointer"
                onMouseEnter={() => {
                  const tooltip = document.getElementById('search-tooltip');
                  if (tooltip) {
                    tooltip.classList.remove('hidden');
                  }
                }}
                onMouseLeave={() => {
                  const tooltip = document.getElementById('search-tooltip');
                  if (tooltip) {
                    tooltip.classList.add('hidden');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </span>
              <div id="search-tooltip" className="hidden absolute left-0 mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-80">
                <p className="text-sm mb-2 font-medium">How to use the search:</p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Search race names (e.g., "London Marathon")</li>
                  <li>Filter by country (e.g., "France" or "Japan")</li>
                  <li>Find by distance (e.g., "Marathon" or "10K")</li>
                  <li>Filter by surface (e.g., "Road" or "Trail")</li>
                  <li>Search any other column data</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col w-full' : 'items-center'} gap-3 sm:w-auto`}>
            {/* Active filter badges */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex items-center flex-wrap filter-badges">
                <span className="text-xs font-medium mr-2" style={{ color: BRAND.colors.muted }}>Filters:</span>
                {Object.keys(activeFilters).map((filter) => (
                  <span key={filter} className="text-xs px-3 py-2 rounded mr-1 mb-1" style={{ backgroundColor: `${BRAND.colors.primary}20`, color: BRAND.colors.dark }}>
                    {filter}
                  </span>
                ))}
                <button 
                  onClick={clearFilters}
                  className="text-xs ml-1 px-2 py-1 hover:font-medium min-h-[35px]"
                  style={{ color: BRAND.colors.primary }}
                >
                  Clear
                </button>
              </div>
            )}
            
            {/* Unit toggle button - now moved to the right */}
            <button
              onClick={toggleUnitSystem}
              className={`unit-toggle-btn ${isMobile ? 'w-full justify-center' : 'ml-auto'}`}
              aria-label={`Switch to ${unitSystem === 'metric' ? 'imperial' : 'metric'} units`}
            >
              {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
            </button>
          </div>
        </div>

        {/* Empty state */}
        {rowData && rowData.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p style={{ color: BRAND.colors.muted }}>No race data available.</p>
          </div>
        ) : (
          /* AG Grid Table */
          <div 
            className="ag-theme-quartz rounded-lg overflow-hidden grid-container"
            style={{
              height: isMobile ? '70vh' : 'calc(100vh - 250px)', // Responsive height
              minHeight: isMobile ? '400px' : '500px',
              width: '100%',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              ...gridTheme
            }}
          >
            <AgGridReact
              rowData={rowData || []}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={isMobile ? 25 : 50}
              paginationPageSizeSelector={isMobile ? [10, 25, 50] : [25, 50, 100, 250]}
              rowSelection="multiple"
              enableCellTextSelection={true}
              ensureDomOrder={true}
              rowHeight={isMobile ? 48 : 40} // Taller rows on mobile for touch
              headerHeight={isMobile ? 56 : 48} // Taller header on mobile
              animateRows={true}
              suppressMenuHide={!isMobile} // Hide menu on mobile
              suppressContextMenu={isMobile} // Suppress context menu on mobile
              alwaysShowHorizontalScroll={false}
              alwaysShowVerticalScroll={false}
              onGridReady={onGridReady}
              onFilterChanged={onFilterChanged}
              quickFilterText={searchText}
            />
          </div>
        )}
      </div>
      <NewsletterSignup />
    </>
  )
}