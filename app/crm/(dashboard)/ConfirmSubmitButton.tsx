"use client";

// Drop-in replacement for a plain <button type="submit"> inside a
// <form action={someServerAction}> — asks for confirmation before letting
// the native form submission (and therefore the server action) proceed.
// Works inside Server Component forms: only this button needs to be a
// Client Component, not the surrounding form/page.
export function ConfirmSubmitButton({
  confirmMessage,
  children,
  className,
}: {
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
