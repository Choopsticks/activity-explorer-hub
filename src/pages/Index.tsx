import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ActivityCard from '@/components/ActivityCard';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import FilterCarousel from '@/components/FilterCarousel';
import CityFilterCarousel from '@/components/CityFilterCarousel';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import { categories, locations, ageRanges } from '@/data/activities';
import { Palette, Users, Mountain, BookOpen, Music, Utensils, HeartPulse, FlaskConical, Monitor, Popcorn, Gamepad2 } from 'lucide-react';
import { fetchFeaturedActivities, fetchPopularActivities, fetchActivities } from '@/services';
import { useQuery } from '@tanstack/react-query';
import ActivityFooter from '@/components/activity/ActivityFooter';
import MapDialog from '@/components/MapDialog';

const safeToLowerCase = (str: any): string => {
  if (typeof str === 'string') {
    return str.toLowerCase();
  }
  return '';
};

const Index = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 16]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  
  const cities = [...new Set(locations.map(loc => loc.city))]
    .filter(Boolean)
    .map(city => ({ id: city?.toLowerCase() || '', name: city || '' }));
  
  const {
    data: allActivities = []
  } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities
  });
  
  const {
    data: featuredActivities = []
  } = useQuery({
    queryKey: ['featuredActivities'],
    queryFn: fetchFeaturedActivities
  });
  
  const {
    data: popularActivities = []
  } = useQuery({
    queryKey: ['popularActivities'],
    queryFn: () => fetchPopularActivities(4)
  });
  
  useEffect(() => {
    let filtered = [...allActivities];
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category && safeToLowerCase(activity.category) === categoryFilter.toLowerCase());
    }
    
    if (locationFilter !== 'all') {
      if (locationFilter.startsWith('city-')) {
        const city = locationFilter.replace('city-', '');
        filtered = filtered.filter(activity => activity.city === city);
      } else {
        filtered = filtered.filter(activity => 
          activity.location && 
          typeof activity.location === 'string' && 
          safeToLowerCase(activity.location) === locationFilter.toLowerCase()
        );
      }
    }
    
    filtered = filtered.filter(activity => {
      const minAge = activity.min_age || 0;
      const maxAge = activity.max_age || 18;
      return minAge <= ageRange[1] && maxAge >= ageRange[0];
    });
    
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPages);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedActivities = filtered.slice(startIndex, startIndex + itemsPerPage);
    setFilteredActivities(paginatedActivities);
  }, [allActivities, categoryFilter, locationFilter, ageRange, currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById('activity-list')?.offsetTop ?? 0,
      behavior: 'smooth'
    });
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Arts & Crafts':
        return <Palette size={24} />;
      case 'Sports':
        return <HeartPulse size={24} />;
      case 'Outdoors':
        return <Mountain size={24} />;
      case 'Education':
        return <BookOpen size={24} />;
      case 'Gaming':
        return <Gamepad2 size={24} />;
      case 'Entertainment':
        return <Popcorn size={24} />;
      case 'Monitor':
        return <Monitor size={24} />;
      case 'Music':
        return <Music size={24} />;
      case 'Cooking':
        return <Utensils size={24} />;
      case 'Science':
        return <FlaskConical size={24} />;
      default:
        return <Users size={24} />;
    }
  };  
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Arts & Crafts':
        return 'bg-[#F3EE16]'; // Bright yellow
      case 'Sports':
        return 'bg-[#41DBBE]'; // Vibrant teal
      case 'Outdoors':
        return 'bg-[#26902A]'; // Bold green
      case 'Education':
        return 'bg-[#425E9C]'; // Deep blue
      case 'Music':
        return 'bg-[#AD59B0]'; // Rich purple
      case 'Cooking':
        return 'bg-[#F06F5D]'; // Soft red-orange
      case 'Science':
        return 'bg-[#BDC939]'; // Lime green
      case 'Gaming':
        return 'bg-[#FF4B4B]'; // Bright red
      case 'Entertainment':
        return 'bg-[#F38B9A]'; // Playful pink
      case 'Monitor':
        return 'bg-[#D58C3D]'; // Earthy orange-brown
      default:
        return 'bg-gray-300'; // Neutral fallback color
    }
  };  
  
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
      <section className="mb-10 relative">
        <div className="flex flex-col lg:flex-row items-center lg:items-center lg:gap-8">
          <div className="lg:w-1/3 text-center lg:text-left flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              <span className="text-gray-800"><b>The Largest Kids Activity Platform</b></span>
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gray-800"><b>in the </b></span>
              <span className="text-kids-orange"><b>Philippines</b></span>
              <span className="text-gray-800"><b>.</b></span>
            </h2>
            <div className="text-center lg:text-left py-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                More than 1000+ Activities around the Philippines all in one place!
              </h2>
            </div>
            <Link to="/activities">
              <button
                className="rounded-full bg-kids-orange hover:bg-kids-orange/90 text-white py-2 px-6 rounded text-lg font-medium"
              >
                Explore Activities <i className='bx bx-right-arrow-alt'></i>
              </button>
            </Link>
          </div>

          <div className="lg:w-2/3">
            <FeaturedCarousel activities={featuredActivities} />
          </div>
        </div>
      </section>

        <CategoryFilter categories={categories} selectedCategory={categoryFilter} onChange={id => {
        setCategoryFilter(id);
        setCurrentPage(1);
      }} getCategoryIcon={getCategoryIcon} getCategoryColor={getCategoryColor} />
        
        <section className="mb-8">
          <CityFilterCarousel 
            title="Cities in the Philippines" 
            cities={cities} 
            selectedCity={locationFilter} 
            onChange={id => {
              setLocationFilter(id);
              setCurrentPage(1);
            }} 
          />
          
          <FilterCarousel 
            title="Age Ranges" 
            options={ageRanges} 
            selectedOption={ageRangeFilter} 
            onChange={id => {
              setAgeRangeFilter(id);
              setCurrentPage(1);
            }}
            isAgeFilter={true}
            ageRange={ageRange}
            onAgeRangeChange={(value) => {
              setAgeRange(value);
              setCurrentPage(1);
            }}
          />
        </section>
        
        <section id="activity-list" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Activities Just For You</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.length > 0 ? filteredActivities.map(activity => <ActivityCard key={activity.id} activity={activity} />) : <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No activities found</h3>
                <p className="text-gray-500">Try adjusting your filters or browse all activities</p>
              </div>}
          </div>
          
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          
          <div className="text-center mt-10">
            <Link to="/activities">
              <Button className="bg-kids-orange hover:bg-kids-orange/90 text-white rounded-full px-8 py-6 text-lg font-medium">
                See All Activities
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Button 
        variant="ghost" 
        size="lg" 
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg rounded-full px-6 py-4 z-50 flex items-center gap-2"
        onClick={() => setIsMapDialogOpen(true)}
        aria-label="View map"
      >
        <span className="text-lg font-medium">Show Map</span>
        <i className="bx bx-map-alt text-2xl"></i>
      </Button>

      <MapDialog 
        isOpen={isMapDialogOpen} 
        onClose={() => setIsMapDialogOpen(false)} 
        activities={allActivities}
      />
      <ActivityFooter />
    </div>;
};
export default Index;
