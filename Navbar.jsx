import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as FlowbiteNavbar } from 'flowbite-react';

function Navbar() {
  // Use location to check the current route and apply active styles
  const location = useLocation();

  return (
    <FlowbiteNavbar fluid className="bg-primary">
      {/* Navbar Brand - Logo or Brand name linking to Home */}
      <FlowbiteNavbar.Brand as={Link} to="/">
        <span className="self-center whitespace-nowrap text-xl font-bold text-text">
          WeatherPro
        </span>
      </FlowbiteNavbar.Brand>

      {/* Toggle button for responsive navbar */}
      <FlowbiteNavbar.Toggle />

      {/* Collapsible navbar links */}
      <FlowbiteNavbar.Collapse>
        {/* Home Link */}
        <FlowbiteNavbar.Link
          as={Link}
          to="/"
          active={location.pathname === '/'}
          className="text-text hover:text-accent"
        >
          Home
        </FlowbiteNavbar.Link>

        {/* Monthly Forecast Link */}
        <FlowbiteNavbar.Link
          as={Link}
          to="/monthly"
          active={location.pathname === '/monthly'}
          className="text-text hover:text-accent"
        >
          Monthly
        </FlowbiteNavbar.Link>

        {/* Daily Forecast Link */}
        <FlowbiteNavbar.Link
          as={Link}
          to="/daily"
          active={location.pathname === '/daily'}
          className="text-text hover:text-accent"
        >
          Daily
        </FlowbiteNavbar.Link>

        {/* Visualization Link */}
        <FlowbiteNavbar.Link
          as={Link}
          to="/visualization"
          active={location.pathname === '/visualization'}
          className="text-text hover:text-accent"
        >
          Visualization
        </FlowbiteNavbar.Link>

        {/* Information Link */}
        <FlowbiteNavbar.Link
          as={Link}
          to="/information"
          active={location.pathname === '/information'}
          className="text-text hover:text-accent"
        >
          Information
        </FlowbiteNavbar.Link>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
}

export default Navbar;
