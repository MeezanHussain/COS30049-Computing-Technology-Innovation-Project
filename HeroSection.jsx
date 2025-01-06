function HeroSection({ title, description }) {
    return (
      <section className="bg-gradient-to-br from-primary to-secondary text-background px-8 py-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-l mb-5">
            {description}
          </p>
        </div>
      </section>
    );
}
export default HeroSection;