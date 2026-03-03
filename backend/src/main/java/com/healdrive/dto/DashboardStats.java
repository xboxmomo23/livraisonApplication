package com.healdrive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long enAttente;
    private long accepte;
    private long enCours;
    private long termine;
    private long annule;
    private long total;
}
