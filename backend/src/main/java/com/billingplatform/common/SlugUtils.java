package com.billingplatform.common;

import org.apache.commons.lang3.StringUtils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtils {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern MULTIPLE_DASHES = Pattern.compile("-{2,}");

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) return "";

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String slug = normalized
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]", "-")
                .replaceAll("-{2,}", "-")
                .replaceAll("^-|-$", "");
        return slug;
    }
}
