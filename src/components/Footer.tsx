import { useChromeHidden } from '../context/ScrollChromeContext';
import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();
  const hidden = useChromeHidden();

  return (
    <footer className={`footer${hidden ? ' footer--hidden' : ''}`}>
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__mark" aria-hidden="true" />
          <div>
            <p className="footer__name">Ashish Bhalsod</p>
            <p className="footer__role">Book Explorer · React Project</p>
          </div>
        </div>
        <p className="footer__copy">© {year} Ashish Bhalsod. All rights reserved.</p>
      </div>
    </footer>
  );
}
