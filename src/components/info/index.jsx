import React from "react"

import PageWrapper from "../commonComponents/displays/wrapper"

import Title from "../commonComponents/headers/title"

import Label from "../commonComponents/headers/label"

const DocumentationPage = () => {
  return (
    <PageWrapper>
      <div className="px-10 py-8 rounded-xl text-[#6e859e] bg-white">
          <Title title="📘 Anilist & Anichart Like - Documentation" />
          <section className="my-8">
            <Label name="📌 About the Project"/>
            <p className="text-sm">
              <strong>Anilist & Anichart Like</strong> is a web application built with React and Tailwind CSS, created as a practical exercise following my training in React.js. The goal of this project was to reproduce the sites <a className="text-blue-400 underline" href="https://anilist.co/" target="_blank">Anilist</a> and <a className="text-blue-400 underline" href="https://anichart.net/" target="_blank">Anichart</a> in an educational context, using their official API: <a className="text-blue-400 underline" href="https://anilist.gitbook.io/anilist-apiv2-docs/" target="_blank">Anilist API v2</a>.
            </p>
          </section>
          <section className="my-8">
            <Label name="🧭 Pages Overview"/>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Search Page</strong>: A clone of Anilist's homepage, allowing users to browse and filter anime by multiple criteria (name, genre, year, season, format, status).
              </li>
              <li>
                <strong>Season Page</strong>: Inspired by Anichart.net, this page displays anime by season and includes direct access to other seasons across years.
              </li>
              <li>
                <strong>Studio Page</strong>: Displays all studios with at least one anime released since 2008. Clicking a studio shows the list of anime produced by it.
              </li>
              <li>
                <strong>Airing Page</strong>: Shows upcoming episodes scheduled to air in the current week, starting from today’s date.
              </li>
            </ul>
          </section>
          <section className="my-8">
            <Label name="🛠️ Technologies & Packages"/>
            <p className="text-sm">This project uses several popular React libraries and tools:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
              <li>
                <strong><a className="text-blue-400 underline" href="https://www.npmjs.com/package/framer-motion" target="_blank">framer-motion</a></strong>: For declarative animations and transitions.
              </li>
              <li>
                <strong><a className="text-blue-400 underline" href="https://www.npmjs.com/package/react-infinite-scroll-hook" target="_blank">react-infinite-scroll-hook</a></strong>: Adds infinite scroll capability to lists and feeds.
              </li>
              <li>
                <strong><a className="text-blue-400 underline" href="https://www.npmjs.com/package/react-router-hash-link" target="_blank">react-router-hash-link</a></strong>: Smooth scrolling and hash-based navigation in React Router.
              </li>
              <li>
                <strong><a className="text-blue-400 underline" href="https://www.npmjs.com/package/react-player" target="_blank">react-player</a></strong>: A media player component for embedding videos (YouTube, Vimeo, etc.).
              </li>
              <li>
                <strong><a className="text-blue-400 underline" href="https://www.npmjs.com/package/react-toggle-dark-mode" target="_blank">react-toggle-dark-mode</a></strong>: A sleek switch component for toggling dark/light mode.
              </li>
              <li>
                <strong><a className="text-blue-400 underline" href="https://www.npmjs.com/package/react-tooltip" target="_blank">react-tooltip</a></strong>: Adds tooltips with ease across your components.
              </li>
              <li>
                <strong><a className="text-blue-400 underline" href="https://www.npmjs.com/package/react-icons" target="_blank">react-icons</a></strong>: Popular icons from multiple icon libraries as React components.
              </li>
            </ul>
          </section>
          <section className="my-8">
            <Label name="🔗 Reference Websites"/>
            <p className="text-sm">Design and technical inspiration were taken from:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
              <li>
                <a href="https://freefrontend.com/css-breadcrumbs/" target="_blank" className="text-blue-400 underline">CSS Breadcrumbs</a> – UI ideas for breadcrumb navigation.
              </li>
              <li>
                <a href="https://css-loaders.com/" target="_blank" className="text-blue-400 underline">CSS Loaders</a> – For loading animation designs.
              </li>
              <li>
                <a href="https://cssloaders.github.io/" target="_blank" className="text-blue-400 underline">CSSLoaders GitHub</a> – Another resource for animated loaders.
              </li>
              <li>
                <a href="https://motion.dev/docs/react" target="_blank" className="text-blue-400 underline">motion.dev</a> – Official documentation for framer-motion.
              </li>
              <li>
                <a href="https://coolors.co/" target="_blank" className="text-blue-400 underline">Coolors</a> – Color palette generator used to choose project colors.
              </li>
              <li>
                <a href="https://nikgraf.github.io/react-hooks/" target="_blank" className="text-blue-400 underline">React Hooks Cheatsheet</a> – For referencing custom and built-in hooks.
              </li>
            </ul>
          </section>
          <section className="my-8">
            <Label name="🎯 Purpose"/>
            <p className="text-sm">
              This app is meant to reinforce and apply core React skills including state management, component structure, conditional rendering, API consumption, UI design with Tailwind CSS, and advanced interactions like infinite scroll, tooltips, and routing.
            </p>
          </section>
      </div>
    </PageWrapper>
  )
}

export default DocumentationPage
