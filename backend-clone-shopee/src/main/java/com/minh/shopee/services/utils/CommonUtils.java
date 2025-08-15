package com.minh.shopee.services.utils;

import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.util.HashSet;
import java.util.Set;

public class CommonUtils {
    public static String[] getNullPropertyNames(Object source) {
        try {
            final Set<String> emptyNames = new HashSet<>();
            for (PropertyDescriptor pd : Introspector.getBeanInfo(source.getClass(), Object.class)
                    .getPropertyDescriptors()) {
                Object value = pd.getReadMethod().invoke(source);
                if (value == null) {
                    emptyNames.add(pd.getName());
                }
            }
            return emptyNames.toArray(new String[0]);
        } catch (Exception e) {
            throw new RuntimeException("Error while getting null properties", e);
        }
    }
}
