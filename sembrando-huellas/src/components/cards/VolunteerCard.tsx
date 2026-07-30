import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface VolunteerCardProps {
  volunteer: {
    name: string
    role: string
    bio: string
    photo: string
    skills?: string[]
  }
  className?: string
}

export default function VolunteerCard({
  volunteer,
  className,
}: VolunteerCardProps) {
  return (
    <CardBase
      variant="flat"
      hover
      className={cn('text-center', className)}
    >
      <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full">
        <img
          src={volunteer.photo}
          alt={volunteer.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {volunteer.name}
      </h3>
      <p className="mb-2 text-sm font-medium text-primary-600 dark:text-primary-400">
        {volunteer.role}
      </p>
      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        {volunteer.bio}
      </p>
      {volunteer.skills && volunteer.skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {volunteer.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </CardBase>
  )
}
