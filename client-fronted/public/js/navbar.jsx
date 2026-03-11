import { useEffect, useRef } from "react";

export default function Navbar() {
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const siteMobileMenuBody = document.querySelector(".site-mobile-menu-body");
    const jsCloneNavs = document.querySelectorAll(".js-clone-nav");

    // Clone nav menus
    jsCloneNavs.forEach((nav) => {
      const navCloned = nav.cloneNode(true);
      navCloned.className = "site-nav-wrap";
      siteMobileMenuBody.appendChild(navCloned);
    });

    // Handle dropdowns
    setTimeout(() => {
      const hasChildrens = document
        .querySelector(".site-mobile-menu")
        .querySelectorAll(".has-children");

      let counter = 0;

      hasChildrens.forEach((hasChild) => {
        const refEl = hasChild.querySelector("a");

        const newElSpan = document.createElement("span");
        newElSpan.className = "arrow-collapse collapsed";

        hasChild.insertBefore(newElSpan, refEl);

        newElSpan.setAttribute("data-bs-toggle", "collapse");
        newElSpan.setAttribute("data-bs-target", `#collapseItem${counter}`);

        const dropdown = hasChild.querySelector(".dropdown");
        dropdown.className = "collapse";
        dropdown.id = `collapseItem${counter}`;

        counter++;
      });
    }, 300);

    // Toggle menu
    const menuToggle = document.querySelectorAll(".js-menu-toggle");

    const toggleHandler = (e) => {
      document.body.classList.toggle("offcanvas-menu");
      menuToggle.forEach((btn) => btn.classList.toggle("active"));
    };

    menuToggle.forEach((btn) => btn.addEventListener("click", toggleHandler));

    // Close when clicking outside
    const outsideClick = (event) => {
      const isClickInside = mobileMenuRef.current.contains(event.target);
      const isToggle = [...menuToggle].some((btn) =>
        btn.contains(event.target)
      );

      if (!isClickInside && !isToggle) {
        document.body.classList.remove("offcanvas-menu");
        menuToggle.forEach((btn) => btn.classList.remove("active"));
      }
    };

    document.addEventListener("click", outsideClick);

    // Cleanup
    return () => {
      menuToggle.forEach((btn) =>
        btn.removeEventListener("click", toggleHandler)
      );
      document.removeEventListener("click", outsideClick);
    };
  }, []);

  return (
    <>
      {/* MOBILE MENU */}
      <div ref={mobileMenuRef} className="site-mobile-menu">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close js-menu-toggle">✕</div>
        </div>
        <div className="site-mobile-menu-body"></div>
      </div>

      {/* TOGGLE BUTTON */}
      <button className="js-menu-toggle btn btn-primary">Menu</button>
    </>
  );
}






// (function(){

// 	'use strict'


// 	var siteMenuClone = function() {
// 		var jsCloneNavs = document.querySelectorAll('.js-clone-nav');
// 		var siteMobileMenuBody = document.querySelector('.site-mobile-menu-body');
		


// 		jsCloneNavs.forEach(nav => {
// 			var navCloned = nav.cloneNode(true);
// 			navCloned.setAttribute('class', 'site-nav-wrap');
// 			siteMobileMenuBody.appendChild(navCloned);
// 		});

// 		setTimeout(function(){

// 			var hasChildrens = document.querySelector('.site-mobile-menu').querySelectorAll(' .has-children');

// 			var counter = 0;
// 			hasChildrens.forEach( hasChild => {
				
// 				var refEl = hasChild.querySelector('a');

// 				var newElSpan = document.createElement('span');
// 				newElSpan.setAttribute('class', 'arrow-collapse collapsed');

// 				// prepend equivalent to jquery
// 				hasChild.insertBefore(newElSpan, refEl);

// 				var arrowCollapse = hasChild.querySelector('.arrow-collapse');
// 				arrowCollapse.setAttribute('data-bs-toggle', 'collapse');
// 				arrowCollapse.setAttribute('data-bs-target', '#collapseItem' + counter);

// 				var dropdown = hasChild.querySelector('.dropdown');
// 				dropdown.setAttribute('class', 'collapse');
// 				dropdown.setAttribute('id', 'collapseItem' + counter);

// 				counter++;
// 			});

// 		}, 1000);


// 		// Click js-menu-toggle

// 		var menuToggle = document.querySelectorAll(".js-menu-toggle");
// 		var mTog;
// 		menuToggle.forEach(mtoggle => {
// 			mTog = mtoggle;
// 			mtoggle.addEventListener("click", (e) => {
// 				if ( document.body.classList.contains('offcanvas-menu') ) {
// 					document.body.classList.remove('offcanvas-menu');
// 					mtoggle.classList.remove('active');
// 					mTog.classList.remove('active');
// 				} else {
// 					document.body.classList.add('offcanvas-menu');
// 					mtoggle.classList.add('active');
// 					mTog.classList.add('active');
// 				}
// 			});
// 		})



// 		var specifiedElement = document.querySelector(".site-mobile-menu");
// 		var mt, mtoggleTemp;
// 		document.addEventListener('click', function(event) {
// 			var isClickInside = specifiedElement.contains(event.target);
// 			menuToggle.forEach(mtoggle => {
// 				mtoggleTemp = mtoggle
// 				mt = mtoggle.contains(event.target);
// 			})

// 			if (!isClickInside && !mt) {
// 				if ( document.body.classList.contains('offcanvas-menu') ) {
// 					document.body.classList.remove('offcanvas-menu');
// 					mtoggleTemp.classList.remove('active');
// 				}
// 			}

// 		});

// 	}; 
// 	siteMenuClone();


// })()