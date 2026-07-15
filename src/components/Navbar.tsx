import { NavLink } from 'react-router-dom';
import { useChromeHidden } from '../context/ScrollChromeContext';
import { useFavorites } from '../context/FavoritesContext';
import { IconHeart, IconSearch } from './Icons';
import './Navbar.css';

export function Navbar() {
  const { favoritesCount } = useFavorites();
  const hidden = useChromeHidden();

  return (
    <header className={`navbar${hidden ? ' navbar--hidden' : ''}`}>
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" aria-label="Book Explorer home">
          <span className="navbar__mark" aria-hidden="true" />
          <span className="navbar__name">Book Explorer</span>
        </NavLink>

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            <IconSearch size={16} />
            Search
          </NavLink>
          <NavLink
            id="nav-favorites"
            to="/favorites"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            <IconHeart size={16} filled={favoritesCount > 0} />
            Favorites
            {favoritesCount > 0 && (
              <span className="navbar__badge" aria-label={`${favoritesCount} favorites`}>
                {favoritesCount}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
