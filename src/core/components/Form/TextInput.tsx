import React, { forwardRef } from "react";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

import Skeleton from "./Skeleton";

interface Props {
  label?: string;
  name: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
}

const TextInput = forwardRef<
  HTMLInputElement,
  Props & InputHTMLAttributes<HTMLInputElement>
>(({ label, name, error, className, disabled, loading, ...rest }, ref) => {
  return (
    <>
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className={clsx("label-text", error && "text-error")}>
              {label}
            </span>
          </label>
        )}
        {loading ? (
          <Skeleton />
        ) : (
          <input
            id={name}
            autoComplete={name}
            name={name}
            {...rest}
            ref={ref}
            disabled={disabled}
            className={clsx(
              "input-bordered input w-full",
              error && "input-error",
              className
            )}
          />
        )}

        {/* {error && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
       {!isDate &&  <ExclamationCircleIcon
            className="h-5 w-5 text-error"
            aria-hidden="true"
          />}
        </div>
      )} */}
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </>
  );
});


TextInput.displayName = "TextInput";

export default TextInput;
