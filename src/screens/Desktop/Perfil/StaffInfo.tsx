import React from "react";
import { Mail, MapPin, Building2 } from "lucide-react";

interface Props {
  name?: string;
  email?: string;
  institution?: string;
  location?: string;
}

export default function StaffInfo({
  name,
  email,
  institution,
  location,
}: Props) {
  return (
    <section
      aria-labelledby="profile-heading"
      className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-200"
    >
      <h2 id="profile-heading" className="sr-only">
        Informações
      </h2>
      <dl className="space-y-4">
        <div>
          <dt className="text-gray-700 text-sm">Nome completo</dt>
          <dd className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
            {name}
          </dd>
        </div>

        <div>
          <dt className="text-gray-700 text-sm">Email</dt>
          <dd className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
            <Mail className="mr-2 w-5 h-5 text-gray-400" />
            {email}
          </dd>
        </div>

        {institution && (
          <div>
            <dt className="text-gray-700 text-sm">Instituição</dt>
            <dd className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
              <Building2 className="mr-2 w-5 h-5 text-gray-400" />
              {institution}
            </dd>
          </div>
        )}

        {location && (
          <div>
            <dt className="text-gray-700 text-sm">Localização</dt>
            <dd>
              <address className="not-italic h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                <MapPin className="mr-2 w-5 h-5 text-gray-400" aria-hidden />
                <span>{location}</span>
              </address>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
