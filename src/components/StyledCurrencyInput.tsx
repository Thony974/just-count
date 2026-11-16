import { useEffect, useRef, useState } from "react";

import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";

/**
 * /!\ Keep this wrapper for uncontrolled inputs only /!\
 * Passing a controlled `value` here makes the library reformat an already
 * formatted string while the user is typing; in French locale that turns the
 * decimal comma into a blank/space-like character during replacement...
 * But as Primereact InputNumber does not handle decimal input intuitively on some mobile
 * browsers, we use this component for the expense input field which is uncontrolled.
 *
 * This component also handles form reset events to reset the input value.
 * @param param0
 * @returns
 */
export function StyledCurrencyInput({
  className,
  ...props
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [resetVersion, setResetVersion] = useState(0);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;

    const handleReset = () => setResetVersion((value) => value + 1);
    form.addEventListener("reset", handleReset);

    return () => form.removeEventListener("reset", handleReset);
  }, []);

  return (
    <CurrencyInput
      key={resetVersion}
      ref={inputRef}
      {...props}
      // Set same default classes as PrimeReact InputText
      className={["p-inputtext", "p-component", className]
        .filter(Boolean)
        .join(" ")}
      intlConfig={{ locale: "fr-FR", currency: "EUR" }}
      placeholder="0,00 €"
      decimalsLimit={2}
    />
  );
}
