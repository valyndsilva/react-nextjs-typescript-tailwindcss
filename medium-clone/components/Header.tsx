import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header>
      <div>
        <Link href="/">
          <img
            src="https://github.com/valyndsilva/react-nextjs-typescript-tailwindcss/blob/main/medium-clone/assets/images/medium-logo.png"
            alt="Medium icon"
          />
        </Link>
      </div>
      <div></div>
      <h1>Header Goes Here</h1>
    </header>
  )
}

export default Header
