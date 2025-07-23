/**
 * Utilidades para manejo de fechas con soporte para zona horaria de Colombia
 * Proporciona funciones flexibles para formatear fechas según diferentes necesidades
 */

/**
 * Opciones de configuración para el formateo de fechas
 * @interface DateFormatOptions
 */
export interface DateFormatOptions {
	/** Si debe ajustar para zona horaria de Colombia (America/Bogota) */
	useColombiaTimezone?: boolean;
	/** Si debe aplicar corrección de un día (para casos de desfase) */
	applyDayOffset?: boolean;
	/** Offset en días a aplicar (positivo = adelante, negativo = atrás) */
	dayOffset?: number;
	/** Formato de salida deseado */
	outputFormat?: "iso" | "display" | "short" | "custom";
	/** Opciones personalizadas para toLocaleDateString cuando outputFormat es 'custom' */
	customFormat?: Intl.DateTimeFormatOptions;
}

/**
 * Convierte una fecha a string con opciones flexibles de formateo y ajustes de zona horaria
 *
 * @param {Date | string} date - La fecha a convertir (puede ser objeto Date o string)
 * @param {DateFormatOptions} options - Opciones de configuración para el formateo
 * @param {boolean} [options.useColombiaTimezone=false] - Si debe ajustar para zona horaria de Colombia
 * @param {boolean} [options.applyDayOffset=false] - Si debe aplicar corrección de días
 * @param {number} [options.dayOffset=0] - Número de días a ajustar (+ adelante, - atrás)
 * @param {string} [options.outputFormat="iso"] - Formato de salida: 'iso', 'display', 'short', 'custom'
 * @param {Intl.DateTimeFormatOptions} [options.customFormat] - Opciones personalizadas para formato custom
 * @returns {string} La fecha formateada según las opciones especificadas
 *
 * @example
 * ```typescript
 * // Formato ISO básico
 * getDateString(new Date(), { outputFormat: 'iso' })
 * // → "2025-07-22"
 *
 * // Con ajuste de zona horaria de Colombia
 * getDateString(new Date(), { useColombiaTimezone: true })
 * // → "2025-07-22" (ajustado a UTC-5)
 *
 * // Con offset de días
 * getDateString(new Date(), { applyDayOffset: true, dayOffset: 1 })
 * // → "2025-07-23" (un día adelante)
 *
 * // Formato de visualización
 * getDateString(new Date(), { outputFormat: 'display' })
 * // → "lun, 22 jul"
 * ```
 */
export function getDateString(
	date: Date | string,
	options: DateFormatOptions = {},
): string {
	const {
		useColombiaTimezone = false,
		applyDayOffset = false,
		dayOffset = 0,
		outputFormat = "iso",
	} = options;

	// Convertir a Date si viene como string
	let workingDate = new Date(date);

	// Aplicar offset de días si está habilitado
	if (applyDayOffset && dayOffset !== 0) {
		workingDate = new Date(workingDate);
		workingDate.setDate(workingDate.getDate() + dayOffset);
	}

	// Ajustar para zona horaria de Colombia si está habilitado
	if (useColombiaTimezone) {
		try {
			const colombiaDateString = workingDate.toLocaleString("en-US", {
				timeZone: "America/Bogota",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			});
			const [month, day, year] = colombiaDateString.split("/");
			workingDate = new Date(
				parseInt(year),
				parseInt(month) - 1,
				parseInt(day),
			);
		} catch (error) {
			console.warn("Error applying Colombia timezone, using fallback:", error);
			// Fallback: usar método simple
			workingDate = new Date(
				workingDate.getTime() - workingDate.getTimezoneOffset() * 60000,
			);
		}
	}

	// Formatear según el tipo de salida
	switch (outputFormat) {
		case "iso": {
			const year = workingDate.getFullYear();
			const month = String(workingDate.getMonth() + 1).padStart(2, "0");
			const day = String(workingDate.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		}

		case "display":
			return workingDate.toLocaleDateString("es-CO", {
				weekday: "short",
				day: "numeric",
				month: "short",
			});

		case "short":
			return workingDate.toLocaleDateString("es-CO", {
				day: "numeric",
				weekday: "short",
			});

		case "custom":
			return workingDate.toLocaleDateString("es-CO", options.customFormat);

		default:
			return workingDate.toISOString().split("T")[0];
	}
}

/**
 * Formatea una fecha desde string ISO (YYYY-MM-DD) a formato de visualización legible
 *
 * @param {string} dateString - String de fecha en formato ISO (YYYY-MM-DD)
 * @param {"display" | "short" | "custom"} [format="display"] - Tipo de formato de salida
 * @param {Intl.DateTimeFormatOptions} [customOptions] - Opciones personalizadas para formato custom
 * @returns {string} La fecha formateada para visualización
 *
 * @example
 * ```typescript
 * // Formato de visualización completo
 * formatDateFromString("2025-07-22", "display")
 * // → "lun, 22 jul"
 *
 * // Formato corto
 * formatDateFromString("2025-07-22", "short")
 * // → "22 lun"
 *
 * // Formato personalizado
 * formatDateFromString("2025-07-22", "custom", {
 *   weekday: 'long',
 *   day: 'numeric',
 *   month: 'long'
 * })
 * // → "lunes, 22 julio"
 * ```
 */
export function formatDateFromString(
	dateString: string,
	format: "display" | "short" | "custom" = "display",
	customOptions?: Intl.DateTimeFormatOptions,
): string {
	const [year, month, day] = dateString.split("-").map(Number);
	const date = new Date(year, month - 1, day);

	switch (format) {
		case "display":
			return date.toLocaleDateString("es-CO", {
				weekday: "short",
				day: "numeric",
				month: "short",
			});
		case "short":
			return date.toLocaleDateString("es-CO", {
				day: "numeric",
				weekday: "short",
			});
		case "custom":
			return date.toLocaleDateString("es-CO", customOptions);
		default:
			return dateString;
	}
}

/**
 * Detecta si una fecha necesita corrección de zona horaria comparando con zona horaria de Colombia
 *
 * @param {Date} date - La fecha a analizar
 * @returns {boolean} true si la fecha tiene problemas de zona horaria, false en caso contrario
 *
 * @description
 * Esta función compara la representación ISO de la fecha original con la fecha ajustada
 * a la zona horaria de Colombia (America/Bogota). Si son diferentes, indica que hay
 * un problema de zona horaria que puede necesitar corrección.
 *
 * @example
 * ```typescript
 * const date = new Date("2025-07-22T06:00:00.000Z"); // UTC
 * detectTimezoneIssue(date)
 * // → true (porque en Colombia sería 2025-07-21)
 *
 * const localDate = new Date("2025-07-22T12:00:00");
 * detectTimezoneIssue(localDate)
 * // → false (si ya está en hora local)
 * ```
 */
export function detectTimezoneIssue(date: Date): boolean {
	const originalDateString = date.toISOString().split("T")[0];
	const colombiaDateString = getDateString(date, { useColombiaTimezone: true });
	return originalDateString !== colombiaDateString;
}

/**
 * Configuraciones predefinidas para casos comunes de formateo de fechas
 *
 * @description
 * Proporciona presets listos para usar que cubren los casos más comunes:
 * - Fechas normales sin problemas
 * - Fechas con problemas de zona horaria
 * - Fechas con desfase de días
 * - Fechas con múltiples problemas
 * - Formato de visualización directo
 *
 * @example
 * ```typescript
 * // Usar preset normal
 * const options = DatePresets.normal();
 * getDateString(date, options);
 *
 * // Usar preset con offset de días
 * const options = DatePresets.withDayOffset(2); // +2 días
 * getDateString(date, options);
 * ```
 */
export const DatePresets = {
	/**
	 * Para datos que ya están en formato correcto y no necesitan ajustes
	 * @returns {DateFormatOptions} Configuración para fechas normales
	 */
	normal: (): DateFormatOptions => ({
		useColombiaTimezone: false,
		applyDayOffset: false,
		outputFormat: "iso",
	}),

	/**
	 * Para datos con problemas de zona horaria que necesitan ajuste a Colombia
	 * @returns {DateFormatOptions} Configuración con ajuste de zona horaria
	 */
	colombiaTimezone: (): DateFormatOptions => ({
		useColombiaTimezone: true,
		applyDayOffset: false,
		outputFormat: "iso",
	}),

	/**
	 * Para datos con desfase de días que necesitan corrección
	 * @param {number} [offset=1] - Número de días a ajustar (positivo = adelante)
	 * @returns {DateFormatOptions} Configuración con offset de días
	 */
	withDayOffset: (offset: number = 1): DateFormatOptions => ({
		useColombiaTimezone: false,
		applyDayOffset: true,
		dayOffset: offset,
		outputFormat: "iso",
	}),

	/**
	 * Para datos con problemas de zona horaria Y desfase de días
	 * @param {number} [offset=1] - Número de días a ajustar (positivo = adelante)
	 * @returns {DateFormatOptions} Configuración con corrección completa
	 */
	fullCorrection: (offset: number = 1): DateFormatOptions => ({
		useColombiaTimezone: true,
		applyDayOffset: true,
		dayOffset: offset,
		outputFormat: "iso",
	}),

	/**
	 * Para formato de visualización directa sin necesidad de conversión posterior
	 * @returns {DateFormatOptions} Configuración para formato de visualización
	 */
	display: (): DateFormatOptions => ({
		useColombiaTimezone: false,
		applyDayOffset: false,
		outputFormat: "display",
	}),
};

/**
 * Función de conveniencia que detecta automáticamente el mejor preset para una fecha
 *
 * @param {Date} date - La fecha a analizar y formatear
 * @param {keyof typeof DatePresets} [fallbackPreset="normal"] - Preset a usar si no se detectan problemas
 * @returns {string} La fecha formateada usando el preset más apropiado
 *
 * @description
 * Esta función analiza automáticamente la fecha para detectar problemas de zona horaria
 * y aplica el preset más apropiado:
 * - Si detecta problemas de zona horaria, usa `colombiaTimezone`
 * - Si no hay problemas, usa el preset especificado en `fallbackPreset`
 *
 * @example
 * ```typescript
 * // Detección automática con preset normal por defecto
 * smartDateFormat(new Date())
 * // → "2025-07-22" (o fecha ajustada si hay problemas de zona horaria)
 *
 * // Con preset de fallback personalizado
 * smartDateFormat(new Date(), "display")
 * // → "lun, 22 jul" (si no hay problemas de zona horaria)
 *
 * // Si hay problemas de zona horaria, siempre usa colombiaTimezone
 * smartDateFormat(problematicDate, "display")
 * // → "2025-07-21" (fecha ajustada a Colombia, formato ISO)
 * ```
 */
export function smartDateFormat(
	date: Date,
	fallbackPreset: keyof typeof DatePresets = "normal",
): string {
	// Detectar si hay problemas de zona horaria
	const hasTimezoneIssue = detectTimezoneIssue(date);

	if (hasTimezoneIssue) {
		return getDateString(date, DatePresets.colombiaTimezone());
	}

	return getDateString(date, DatePresets[fallbackPreset]());
}
