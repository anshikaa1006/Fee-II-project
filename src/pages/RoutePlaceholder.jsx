function RoutePlaceholder({ title }) {
  const isGroupModule = ['Movies', 'Sports', 'Comedy & Theatre'].includes(title)

  return (
    <main>
      <h1>{title}</h1>
      <p>{isGroupModule ? 'Coming soon — this section is being developed.' : 'This route is ready for the next project phase.'}</p>
    </main>
  )
}

export default RoutePlaceholder
