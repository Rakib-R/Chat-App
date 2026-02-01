

 export const userButtonAppearance = {
    elements: {
      // The outermost wrapper
      rootBox: "w-150",            
      userButtonTrigger: "...",       
      // OVERWRITE HEIGHT & WIDTH 
      // SEE GLOBAL CSS
      
       // The clickable avatar button
      userButtonPopoverActionButton__addAccount: "text-purple-500 hover:bg-purple-50",
      // Styles the "Sign out of all accounts" button
      userButtonPopoverActionButton__signOutAll: "text-red-500",
    },
  };
  export const customAppearance = {
   
     cssLayerName :  'clerk',
    // theme: shadesOfPurple ,
      variables: {
        colorPrimary: 'green',
        colorTextSecondary : 'violet',
        colorBackground: '', // Deep, charcoal background
        colorForeground: 'purple',
        colorText: 'green', // Light, distinct text
        fontFamily: 'var(--font-roboto)', 
      },
      
    layout: {
      // Place social buttons at the bottom
      // socialButtonsPlacement: 'bottom | undefined',
      // Change the placement of the logo to outside the card (for a cleaner look)
      shimmer: false
    },

  elements: {
        card: {
          backgroundColor: "", //ORGANIZATIN ADD BUTTON BACKGROUUND
        },
        formButtonPrimary: {
        className: "!bg-indigo-600 hover:!bg-indigo-700 !transition-all duration-300 rounded-lg !py-3 text-lg !font-bold !uppercase"
      },

       organizationPreviewTextContainer: "block", // Ensures name container is visible
        organizationPreviewMainIdentifier: "text-white font-bold", // Styles the name
      }
  }