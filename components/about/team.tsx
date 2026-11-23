import Image from "next/image";
import Container from "@/components/layout/container";

const team = [
  { name: "Bhagwan Singh Shekhawat", role: "Director & CEO", image: "/bhagwansingh1.jpg" },
  { name: "Ravindra Singh Shekhawat", role: "Managing Director", image: "/ravindra1.jpg" },
  { name: "Raghuman Singh Shekhawat", role: "Leads & Service Manager", image: "/raghuman.webp" },
];

export default function Team() {
  return (
    <section className="py-20">
      <Container className="space-y-12">
        <div>
          <h2 className="font-display text-4xl mb-2 font-semibold sm:text-5xl">Our team</h2>
        <p className="text-muted-foreground text-lg">Our dedicated team is passionate about delivering excellence through creativity, collaboration, and expertise.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <figure key={member.name} className="space-y-4">
              <div className="relative h-72 md:h-96 overflow-hidden rounded-3xl bg-secondary">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-top md:object-center "
                />
              </div>
              <figcaption className="text-center">
                <p className="font-display text-xl font-semibold">{member.name}</p>
                <p className="text-muted-foreground">{member.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}